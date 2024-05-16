import {useEffect, useState} from 'react';
import axios from "axios";
import {SERVER_URL} from "../CONSTS.js";
import {toast} from "react-hot-toast";
import Loader from "./Loader.jsx";
import {X} from "lucide-react";
import AllTracks from "./AllTracks.jsx";

// eslint-disable-next-line react/prop-types
const Playlist = ({id, closeFunction}) => {
    const [isLoading, setLoading] = useState(false)
    const [playlist, setPlaylist] = useState({})
    const [allTracksOpened, setAllTracksOpened] = useState(false)
    const [hoverTrack, setHoverTrack] = useState(0)

    useEffect(() => {
        async function Init() {
            if (!id) return
            setLoading(true)
            const res = await axios.get(`${SERVER_URL}/api/playlists/${id}`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)
            })
            console.log(res.data)
            if (res.status === 200) {
                setPlaylist(res.data)
            }
            setLoading(false)
        }

        Init()
    }, [])

    const addTrackToPlaylist = async (trackId) => {
        const res = await axios.post(`${SERVER_URL}/api/playlists/${id}/tracks/${trackId}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res.data)
        if (res.status === 200) {
            console.log(playlist)
            setPlaylist(prevState => {
                return {...prevState, tracks: [res.data, ...prevState.tracks]}
            })
            toast.success('Track added!')
        }
    }
    const RemoveTrackFromPlaylistSubmit = async (trackId) => {
        const res = await axios.delete(`${SERVER_URL}/api/playlists/${id}/tracks/${trackId}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res.data)
        if (res.status === 200) {
            console.log(playlist)
            setPlaylist(prevState => {
                return {...prevState, tracks: [...prevState.tracks.filter((item) => item.id !== trackId)]}
            })
        }
    }

    if (isLoading || !playlist || !playlist.tracks) return <div
        className={'h-dvh w-dvw flex justify-center items-center'}><Loader/></div>
    return (
        <>
            {allTracksOpened ? <AllTracks addTrackToPlaylist={addTrackToPlaylist}
                                          closeAllTracksFunction={() => setAllTracksOpened(false)}/> : <div></div>}
            <div style={{backgroundColor: "rgba(0, 0, 0, 0.75)"}}
                 className={'h-dvh w-dvw z-30 fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center'}>
                <div style={{width: '80%', height: '90%'}} className={'bg-bg relative rounded-3xl p-7'}>
                    <button className={'absolute top-2 right-2'} onClick={closeFunction}><X/></button>
                    <div className={'flex items-center'}>
                        <div className={'text-2xl text-gray-800 max-w-80 break-words'}>Плейлист: {playlist.name}</div>
                        <div className={'ml-24 text-lg text-gray-500 font-bold'}>{playlist.tracks.length}
                            {playlist.tracks.length === 0 ? " треков" : playlist.tracks.length == 1 ? " трек" : playlist.tracks.length < 5 ? " трека" : " треков"}
                        </div>
                        <button onClick={() => setAllTracksOpened(true)}
                                className={'h-10 rounded-xl bg-primary px-6 mt-5 ml-16'}>Добавить трек
                        </button>
                    </div>
                    {playlist.tracks && playlist.tracks.length > 0 ?
                        <div>
                            <div>Треки в плейлисте:</div>
                            <div style={{width: '50%'}} className={'flex flex-col'}>
                                {playlist.tracks.map((track) => (
                                    <div
                                        onMouseEnter={() => {
                                            setHoverTrack(track.id)
                                        }}
                                        onMouseLeave={() => {
                                            setHoverTrack(0)
                                        }}
                                        className={'bg-primary p-4 break-words w-full relative rounded-xl mt-5'}
                                         key={track.id}>
                                        <p className={'text-xl'}>{track.name}</p>
                                        <p className={'text-sm'}>{track.artist}</p>
                                        {track.id === hoverTrack && <div
                                            onClick={(e)=>{e.stopPropagation(); RemoveTrackFromPlaylistSubmit(track.id)}}
                                            className={'cursor-pointer p-2 rounded-xl bg-bg absolute bottom-3 right-3'}>Удалить
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        :
                        <div className={'mt-5 ml-4 text-gray-900 text-lg'}>Нет добавленных треков</div>
                    }
                </div>
            </div>
        </>
    );
};

export default Playlist;