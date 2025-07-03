import {regions_data, nationalities_data, designations_data, grades_data } from "@/data/cm.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Regions') {
    return Response.json({
      data: regions_data,
    });
  }
  else if (url.split("tab=")[1] === 'Nationalities') {
    return Response.json({
      data: nationalities_data,
    });
  }
  else if (url.split("tab=")[1] === 'Designations') {
    return Response.json({
      data:  designations_data,
    });
  }
  else {
    return Response.json({
      data: grades_data
    })
  }

}