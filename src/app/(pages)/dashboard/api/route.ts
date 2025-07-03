import {regions_data, nationalities_data, designations_data, grades_data } from "@/data/cm.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Self Statistics') {
    return Response.json({
      data: regions_data,
    });
  }
  else {
    return Response.json({
      data: grades_data
    })
  }

}