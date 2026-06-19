import { NextResponse }
from "next/server";

export async function GET(
    request: Request
) {

    const { searchParams } =
        new URL(request.url);

    const placeId =
        searchParams.get(
            "placeId"
        );

    const apiKey =
        process.env
            .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const response =
        await fetch(

            `https://places.googleapis.com/v1/places/${placeId}`,

            {
                headers: {

                    "X-Goog-Api-Key":
                        apiKey!,

                    "X-Goog-FieldMask":
                        "displayName,formattedAddress,location"

                }
            }

        );

    const data =
        await response.json();

    console.log(data);

    return NextResponse.json(
        data
    );

}