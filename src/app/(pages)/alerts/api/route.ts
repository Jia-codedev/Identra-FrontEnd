import {email_data, sms_data } from "@/data/alerts.data";

export async function GET(request: Request) {
  const url = request.url;
  if (url.split("tab=")[1] === 'Email') {
    return Response.json({
      data: email_data,
    });
  }
  // else if (url.split("tab=")[1] === 'SMS') {
  //   return Response.json({
  //     data: sms_data,
  //   });
  // }
  else {
    return Response.json({
      data: sms_data,
    })
  }

}