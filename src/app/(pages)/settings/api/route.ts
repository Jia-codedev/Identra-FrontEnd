import { settings_data, notification_data } from "@/data/settings.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Application Setting') {
    return Response.json({
      data: settings_data,
    });
  }
  else if (url.split("tab=")[1] === 'Notification') {
    return Response.json({
      data: notification_data,
    });
  }
  else {
    return Response.json({
      data: settings_data
    })
  }

}