"use client";

import { useEffect, useState } from "react";
import RepartidorLogin from "./RepartidorLogin";
import FlyToLocation from "./FlyToLocation";
import MiUbicacionLayer from "./MiUbicacionLayer";
import RutaRepartidor from "./RutaRepartidor";
import MapaControles from "./MapaControles";
import MotoMarker from "./MotoMarker";
import PuntosRutaLayer from "./PuntosRutaLayer";

import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { obtenerRepartidores } from "../../lib/repartidores";

import {
    obtenerEntregas,
    actualizarCoordenadasEntrega,
} from "../../lib/entregas";

import {
    geocodificarDireccion,
} from "../../lib/geocoding";

import useGeolocalizacion
from "../repartidores/hooks/UseGeolocalizacion";

export default function MapView() {

    const [
        puntosRuta,
        setPuntosRuta,
    ] = useState<
        {
            direccion: string;
            lat: number;
            lng: number;
        }[]
    >([]);

    const [
        repartidorId,
        setRepartidorId,
    ] = useState<string | null>(
        null
    );

    const [
        modoMapa,
        setModoMapa,
    ] = useState<
        "mapa" | "satelite"
    >("mapa");

    const [
        repartidores,
        setRepartidores,
    ] = useState<any[]>([]);

    const [
        repartidorSeleccionado,
        setRepartidorSeleccionado,
    ] = useState("todos");

    useEffect(() => {

        const id =
            localStorage.getItem(
                "repartidorId"
            );

        setRepartidorId(id);

    }, []);

    const posicion =
        useGeolocalizacion(
            repartidorId
        );

    useEffect(() => {

        async function cargar() {

            const data =
                await obtenerRepartidores();

            setRepartidores(
                data || []
            );

        }

        cargar();

        const interval =
            setInterval(
                cargar,
                5000
            );

        return () =>
            clearInterval(
                interval
            );

    }, []);

    async function geocodificarEntregas() {

        if (
            !repartidorSeleccionado ||
            repartidorSeleccionado ===
                "todos"
        ) {
            return;
        }

        const entregas =
            await obtenerEntregas(
                repartidorSeleccionado
            );

        for (
            const entrega
            of entregas
        ) {

            if (
                entrega.latitud &&
                entrega.longitud
            ) {
                continue;
            }

            const coords =
                await geocodificarDireccion(
                    entrega.direccion
                );

            if (!coords) {
                continue;
            }

            await actualizarCoordenadasEntrega(
                entrega.id,
                coords.latitud,
                coords.longitud
            );

            console.log(
                "Geocodificada:",
                entrega.direccion
            );

        }

    }

    function manejarDireccionSeleccionada(
        direccion: string,
        lat: number,
        lng: number
    ) {

        setPuntosRuta(
            (prev) => [

                ...prev,

                {
                    direccion,
                    lat,
                    lng,
                },

            ]
        );

    }

    if (!repartidorId) {

        return (
            <RepartidorLogin
                onLogin={
                    setRepartidorId
                }
            />
        );

    }

    const repartidoresFiltrados =

        repartidorSeleccionado ===
        "todos"

            ? repartidores

            : repartidores.filter(
                (r) =>
                    r.id ===
                    repartidorSeleccionado
            );

    return (

        <div className="space-y-4">

            <MapaControles
                modoMapa={modoMapa}
                setModoMapa={
                    setModoMapa
                }
                repartidores={
                    repartidores
                }
                repartidorSeleccionado={
                    repartidorSeleccionado
                }
                setRepartidorSeleccionado={
                    setRepartidorSeleccionado
                }
                geocodificarEntregas={
                    geocodificarEntregas
                }
                onDireccionSeleccionada={
                    manejarDireccionSeleccionada
                }
            />

            <div className="relative">

                <MapContainer
                    center={posicion}
                    zoom={15}
                    style={{
                        height:
                            "calc(100vh - 220px)",
                        width:
                            "100%",
                    }}
                    className="
                        rounded-xl
                        overflow-hidden
                        shadow
                    "
                >

                    <FlyToLocation
                        position={
                            posicion
                        }
                    />

                    <TileLayer
                        key={
                            modoMapa
                        }
                        attribution={
                            modoMapa ===
                            "satelite"
                                ? "Esri"
                                : "OpenStreetMap"
                        }
                        url={
                            modoMapa ===
                            "satelite"

                                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

                                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        }
                    />

                    <PuntosRutaLayer
                        puntosRuta={
                            puntosRuta
                        }
                    />

                    {repartidorSeleccionado !==
                        "todos" && (

                        <RutaRepartidor
                            repartidorId={
                                repartidorSeleccionado
                            }
                        />

                    )}

                    <MiUbicacionLayer
                        posicion={posicion}
                    />

                    {repartidoresFiltrados

                        .filter(
                            (r) =>
                                r.id !==
                                repartidorId
                        )

                        .map((r) => (

                            r.latitud &&
                            r.longitud && (

                                <MotoMarker
                                    key={r.id}
                                    repartidor={r}
                                />
                            )

                        ))}

                </MapContainer>

            </div>

        </div>

    );

}