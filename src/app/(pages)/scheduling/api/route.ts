import { weeklyschedule_data } from "@/data/scheduling.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Weekly Schedule') {
    return Response.json({
      data: weeklyschedule_data,
    });
  }
  else {
    return Response.json({
      data: weeklyschedule_data,
    })
  }
}