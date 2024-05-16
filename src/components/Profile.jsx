import  {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {SERVER_URL} from "../CONSTS.js";
import {toast} from "react-hot-toast";
import Loader from "./Loader.jsx";
import Playlist from "./Playlist.jsx";

const Profile = () => {
    const params = useParams()
    const [user, setUser] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [playlists, setPlaylists] = useState([])
    const [chosenPlaylistId, setChosenPlaylistId] = useState(0)
    const navigate = useNavigate()
    const [hoverPlaylist, setHoverPlaylist] = useState(0)

    useEffect(() => {
        async function Init() {
            if (!params.id) return
            setLoading(true)
            const res = await axios.get(`${SERVER_URL}/api/users/${params.id}`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)

            })
            console.log(res.data)
            if (res.status === 200) {
                setUser(res.data)
                setPlaylists(res.data.playlists)
            }
            setLoading(false)
        }

        Init()
    }, [params.id])

    const addPlaylistSubmit = async () => {
        if (inputValue.trim() === '') return;
        const res = await axios.post(`${SERVER_URL}/api/playlists?name=${inputValue}&userId=${params.id}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })

        if (res.status === 200) {
            toast.success('Playlist created!')
            setPlaylists(prevState => [res.data, ...prevState])
            setInputValue('')
        }
    }

    const RemovePlaylistSubmit = async (id) => {
        const res = await axios.delete(`${SERVER_URL}/api/playlists/${id}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res)
        if (res.status === 200) {
            toast.success('Playlist removed!')
            setPlaylists(prevState => [...prevState.filter(item => item.id !== id)])
        }
    }

    if (isLoading) return <Loader/>
    return (
        <div className={'flex justify-center'}>
            <button className={'fixed top-2 left-2 px-6 h-10 bg-primary rounded-xl'}
                    onClick={() => navigate('/')}>Главная
            </button>
            {chosenPlaylistId ? <Playlist closeFunction={() => setChosenPlaylistId(0)} id={chosenPlaylistId}/> :
                <div></div>}
            <div style={{maxWidth: '40%'}} className={'px-16 mt-16 flex flex-col'}>
                <div className={'text-2xl text-gray-700 font-bold'}>Пользователь: {user.name}</div>
                <div className={'mt-6 flex justify-between'}>
                    <input value={inputValue}
                           onChange={(e) => {
                               setInputValue(e.target.value)
                           }}
                           onKeyPress={(event) => {
                               if (event.key === 'Enter') addPlaylistSubmit()
                           }}
                           placeholder={'Введите название плейлиста...'}
                           className={'w-60 h-10 outline-none text-sm rounded-2xl px-2 border-2 border-primary'}
                           type="text"/>
                    <button className={'h-10 rounded-xl ml-4 bg-primary px-6'} onClick={() => {
                        addPlaylistSubmit()
                    }}>Добавить
                    </button>
                </div>

                {playlists && playlists?.length ?
                    <div className={'mt-5 flex flex-col'}>
                        <div className={'ml-4'}>Плейлисты:</div>
                        {playlists.map((playlist) => (
                            <div style={{width: '100%'}}
                                 className={'overflow-hidden relative bg-primary rounded-xl mt-3 p-6'}
                                 onClick={() => {
                                     setChosenPlaylistId(playlist.id)
                                 }}
                                 onMouseEnter={() => {
                                     setHoverPlaylist(playlist.id)
                                 }}
                                 onMouseLeave={() => {
                                     setHoverPlaylist(0)
                                 }}
                                 key={playlist.id}>
                                <div className={'break-words'}>{playlist.name}</div>
                                {playlist.id === hoverPlaylist && <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        RemovePlaylistSubmit(playlist.id)
                                    }}
                                    className={'cursor-pointer p-2 rounded-xl bg-bg absolute bottom-3 right-3'}>Удалить
                                </div>}
                            </div>
                        ))}
                    </div> : <div className={'mt-5'}>Нет добавленных плейлистов</div>}
            </div>
        </div>
    );
};

export default Profile;