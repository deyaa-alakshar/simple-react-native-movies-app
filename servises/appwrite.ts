import { Account, Client, Databases, ID, Query, TablesDB } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const dataBase = new Databases(client);
const tablesDB = new TablesDB(client);

export const updataSearchCount = async (query: string, movie: Movie) => {
  try {
    const response = await tablesDB.listRows({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "metrics",
      queries: [Query.equal("searchTerm", query)],
    });
    if (response.rows.length > 0) {
      await tablesDB
        .updateRow({
          databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId: "metrics",
          rowId: response.rows[0].$id,
          data: { count: response.rows[0].count + 1 },
        })
        .then((res) => console.log(res));
    } else {
      await tablesDB
        .createRow({
          databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
          tableId: "metrics",
          rowId: ID.unique(),
          data: {
            searchTerm: query,
            movie_id: movie.id,
            title: movie.title,
            count: 1,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          },
        })
        .then((res) => console.log(res));
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrandingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const response = await tablesDB.listRows({
      databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: "metrics",
      queries: [Query.limit(10), Query.orderDesc("count")],
    });

    return response.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
