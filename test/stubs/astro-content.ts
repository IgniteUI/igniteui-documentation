/** Stand-in for the `astro:content` virtual module in unit tests. */
export function defineCollection<T>(config: T): T { return config; }
