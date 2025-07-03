import { roles_data, privileges_data } from "@/data/security.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Roles') {
    return Response.json({
      data: roles_data,
    });
  }
  else {
    return Response.json({
      data: privileges_data,
    })
  }
}