"use client";

import { useEffect, useState } from "react";
import RepartidorLogin from "./RepartidorLogin";
import FlyToLocation from "./FlyToLocation";
import MiUbicacionLayer from "./MiUbicacionLayer";
import MapaControles from "./MapaControles";
import MotoMarker from "./MotoMarker";
import PuntosRutaLayer from "./PuntosRutaLayer";
import RutaLayer from "./RutaLayer";

import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { obtenerRepartidores } from "../../lib/repartidores";

import {
    obtenerEntregas,
    actualizarCoordenadasEntrega,
    crearEntrega,
    obtenerEntregasPendientes,
    finalizarEntrega,
} from "../../lib/entregas";

import useGeolocalizacion
from "../repartidores/hooks/UseGeolocalizacion";

type PuntoRuta = {
    id: string;
    direccion: string;
    latitud: number;
    longitud: number;
};



export default function MapView() {

    const [
        puntosRuta,
        setPuntosRuta,
    ] = useState<PuntoRuta[]>([]);

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

    useEffect(() => {

        async function cargarRuta() {

            if (
                repartidorSeleccionado ===
                "todos"
            ) {

                setPuntosRuta([]);

                return;

            }

            const entregas =
                await obtenerEntregasPendientes(
                    repartidorSeleccionado
                );

            setPuntosRuta(
                entregas
            );

        }

        cargarRuta();

    }, [repartidorSeleccionado]);

    async function handleFinalizarEntrega(
        entregaId: string
    ) {
        if (
            repartidorSeleccionado ===
            "todos"
        ) {
            return;
        }

        await finalizarEntrega(
            entregaId
        );

        const nuevasEntregas =
            await obtenerEntregasPendientes(
                repartidorSeleccionado
            );

        setPuntosRuta(
            nuevasEntregas
        );
    }

    async function manejarDireccionSeleccionada(
        direccion: string,
        lat: number,
        lng: number
    ) {

        if (
            repartidorSeleccionado ===
            "todos"
        ) {
            return;
        }

        const entregasPendientes =
            await obtenerEntregasPendientes(
                repartidorSeleccionado
            );

        const nuevaEntrega = {
            repartidor_id:
                repartidorSeleccionado,

            direccion,

            latitud: lat,

            longitud: lng,

            orden:
                entregasPendientes.length + 1,
        };

        await crearEntrega(
            nuevaEntrega
        );

        const entregasActualizadas =
            await obtenerEntregasPendientes(
                repartidorSeleccionado
            );

        setPuntosRuta(
            entregasActualizadas
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

            const repartidorActual =
            repartidores.find(
                (r) =>
                    r.id ===
                    repartidorSeleccionado
            );

    function geocodificarEntregas(): void {
        throw new Error("Function not implemented.");
    }

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
                            "calc(100vh - 360px)",
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
                        puntosRuta={puntosRuta}
                        onFinalizarEntrega={
                            handleFinalizarEntrega
                        }
                    />
                    {
                    repartidorActual?.latitud &&
                    repartidorActual?.longitud && (

                        <RutaLayer
                            posicionActual={[
                                Number(
                                    repartidorActual.latitud
                                ),
                                Number(
                                    repartidorActual.longitud
                                ),
                            ]}
                            puntosRuta={puntosRuta}
                        />

                    )
                }


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