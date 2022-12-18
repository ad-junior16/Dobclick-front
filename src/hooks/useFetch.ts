import axios from "axios";
import { useEffect, useState } from "react";
import { HttpRequestType } from "../models/HttpRequest.model";

export function useFetch<T = unknown>(url: string, requestType: HttpRequestType, body: T | null) {

// const [ retorno: type] = useFeatch<Produto>('localhost:3000/produtos',HttpRequestType.GET, usuarioId:int)


    const [data, setData] = useState<T | null>(null);
    const [isFetching, SetIsFetching] = useState(true);

    useEffect(() => {

        if (requestType == HttpRequestType.GET) {

            axios.get(url).then(response => {
                setData(response.data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                SetIsFetching(false);
            })

        }

        if (requestType == HttpRequestType.POST) {
            axios.post(url, body).then(response => {
                setData(response.data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                SetIsFetching(false);
            })
        }

        if (requestType == HttpRequestType.PUT) {
            axios.put(url, body).then(response => {
                setData(response.data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                SetIsFetching(false);
            })
        }

        if (requestType == HttpRequestType.DELETE) {
            axios.post(url, body).then(response => {
                setData(response.data);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                SetIsFetching(false);
            })
        }

    }, []);
    return { data, isFetching }
}