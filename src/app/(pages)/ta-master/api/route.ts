import {reasons_data, holidays_data, schedules_data, ramadandates_data } from "@/data/tam.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Reasons') {
    return Response.json({
      data: reasons_data,
    });
  }
  else if (url.split("tab=")[1] === 'Holidays') {
    return Response.json({
      data: holidays_data,
    });
  }
  else if (url.split("tab=")[1] === 'Schedules') {
    return Response.json({
      data:  schedules_data,
    });
  }
  else {
    return Response.json({
      data: ramadandates_data,
    })
  }

}