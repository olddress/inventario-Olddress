import { NextResponse } from "next/server";

export async function GET(
    request: Request
) {

    const { searchParams } =
        new URL(request.url);

    const input =
        searchParams.get("input");

    if (!input) {

        return NextResponse.json([]);

    }

    const apiKey =
        process.env
            .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const response =
        await fetch(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "X-Goog-Api-Key":
                        apiKey!,

                    "X-Goog-FieldMask":
                        "suggestions.placePrediction.placeId,suggestions.placePrediction.text"
                },

                body: JSON.stringify({
                    input,
                    includedRegionCodes: [
                        "CO"
                    ]
                })
            }
        );

    const data =
        await response.json();

    console.log(data);

    return NextResponse.json(
        data.suggestions || []
    );

}