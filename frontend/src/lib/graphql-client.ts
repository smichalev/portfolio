const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql"

/**
 * `message` holds the backend's machine-readable error code (e.g.
 * "AUTH_INVALID_CREDENTIALS") or "NETWORK_ERROR" for transport failures.
 * Callers localize it via `translateError` from "@/lib/error-messages".
 */
export class GraphQLError extends Error {}

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  accessToken?: string | null
): Promise<T> {
  let res: Response
  try {
    res = await fetch(GRAPHQL_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new GraphQLError("NETWORK_ERROR")
  }

  const json = (await res.json().catch(() => null)) as GraphQLResponse<T> | null

  if (!json) {
    throw new GraphQLError("NETWORK_ERROR")
  }
  if (json.errors?.length) {
    throw new GraphQLError(json.errors[0].message)
  }
  if (!json.data) {
    throw new GraphQLError("NETWORK_ERROR")
  }
  return json.data
}
