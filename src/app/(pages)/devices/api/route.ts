import { devices_status_data } from "@/data/devices.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Devices Status') {
    return Response.json({
      data: devices_status_data,
    });
  }
  else {
    return Response.json({
      data: devices_status_data
    })
  }
}