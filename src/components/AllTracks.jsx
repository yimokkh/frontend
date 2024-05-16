import  {useEffect, useState} from 'react';
import axios from "axios";
import {SERVER_URL} from "../CONSTS.js";
import {toast} from "react-hot-toast";
import Loader from "./Loader.jsx";
import {Plus, X} from "lucide-react";

// eslint-disable-next-line react/prop-types
const AllTracks = ({addTrackToPlaylist,closeAllTracksFunction}) => {
    const [isLoading, setLoading] = useState(false)
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        async function Init() {
            setLoading(true)
            const res = await axios.get(`${SERVER_URL}/api/tracks`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)
                setLoading(false)
                return
            })
            console.log(res)
            if (res.status === 200) {
                setTracks(res.data)
            }
            setLoading(false)
        }

        Init()
    }, [])

    if (isLoading || !tracks) return <div className={'h-dvh w-dvw flex justify-center items-center'}><Loader/></div>
    return (
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.75)"}}
             className={'h-dvh w-dvw fixed top-0 left-0 bottom-0 right-0 z-50 flex justify-center items-center'}>
            <div style={{width: '40%', height: '80%'}} className={'bg-bg  relative rounded-3xl p-7'}>
                <button className={'absolute top-2 right-2'} onClick={closeAllTracksFunction}><X/></button>
                {tracks.length > 0 ?
                    <div className={'h-full'}>
                        <div className={'ml-4'}>Все треки:</div>
                        <div style={{height: '95%'}} className={'overflow-y-scroll'}>
                        {tracks.map((track) => (
                            <div key={track.id} className={'mt-5 mx-2 flex justify-between items-center min-h-20 relative'}>
                                <div className={'bg-primary  rounded-xl px-3 py-5 w-full h-full overflow-x-hidden'}>
                                    <p className={'text-xl break-words'}>{track.name}</p>
                                    <p className={'text-sm break-words'}>{track.artist}</p>
                                </div>
                                <button
                                    onClick={()=>{addTrackToPlaylist(track.id)}}
                                    className={'h-20 w-20 ml-4 rounded-2xl flex items-center justify-center bg-primary border'}><Plus/></button>
                            </div>
                        ))}
                        </div>
                    </div>
                    :
                    <div>Нет созданных треков</div>
                }
            </div>
        </div>
    );
};

export default AllTracks;