import {departments_data, organizationtypes_data } from "@/data/org.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Departments') {
    return Response.json({
      data: departments_data,
    });
  }
  else {
    return Response.json({
      data: organizationtypes_data
    })
  }

}