import { publicApi, serverApi } from "./api";

export async function getBlogs(page: number = 1, limit: number = 10, search: string = "", status: string = "PUBLISHED", categoryId: string = "", authorId: string = "") {
  try {
    const res = await publicApi.get("/blogs", {
        params: {
            page,
            limit,
            search,
            status,
            categoryId,
            authorId,
        },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}