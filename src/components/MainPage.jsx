import  {useEffect, useState} from 'react';
import axios from 'axios'
import {SERVER_URL} from "../CONSTS.js";
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const MainPage = () => {
    const [users, setUsers] = useState([])
    const [tracks, setTracks] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [nameValue, setNameValue] = useState('')
    const [artistValue, setArtistValue] = useState('')
    const [hoverUser, setHoverUser] = useState(0)
    const [hoverTrack, setHoverTrack] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        async function Init1() {
            const res = await axios.get(`${SERVER_URL}/api/users`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)
            })
            if (res.status === 200) {
                setUsers(res.data)
            }
        }

        async function Init2() {
            const res = await axios.get(`${SERVER_URL}/api/tracks`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)
            })
            if (res.status === 200) {
                setTracks(res.data)
                console.log(res.data)
            }
        }

        Init1()
        Init2()
    }, [])

    const addUserSubmit = async () => {
        const name = inputValue
        if (name.trim() === '') return;
        const res = await axios.post(`${SERVER_URL}/api/users?name=${name}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res)
        if (res.status === 200) {
            setUsers(prevState => [res.data, ...prevState])
            setInputValue('')
            toast.success('Successfully added')
        }
    }

    const RemoveUserSubmit = async (id) => {
        if (id === 0) return;
        const res = await axios.delete(`${SERVER_URL}/api/users/${id}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res)
        if (res.status === 200) {
            setUsers(prevState => [...prevState.filter((item) => item.id !== id)])
            toast.success('Successfully deleted')
        }
    }

    const addTrackSubmit = async () => {
        const name = nameValue
        const artist = artistValue
        if (name.trim() === '' || artist.trim() === '') return;
        const res = await axios.post(`${SERVER_URL}/api/tracks?name=${name}&artist=${artist}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res)
        if (res.status === 200) {
            setTracks(prevState => [res.data, ...prevState])
            setNameValue('')
            setArtistValue('')
            toast.success('Successfully added')
        }
    }

    const RemoveTrackSubmit = async (id) => {
        if (id === 0) return;
        const res = await axios.delete(`${SERVER_URL}/api/tracks/${id}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
        })
        console.log(res)
        if (res.status === 200) {
            setTracks(prevState => [...prevState.filter((item) => item.id !== id)])
            toast.success('Successfully deleted')
        }
    }

    return (
        <div className={'flex mt-10 px-16 justify-around flex-wrap'}>
            <div style={{width: '35%'}} className={'flex flex-col '}>
                <div className={'flex justify-between'}>
                    <input value={inputValue}
                           onChange={(e) => {
                               setInputValue(e.target.value)
                           }}
                           onKeyPress={(event) => {
                               if (event.key === 'Enter') addUserSubmit()
                           }}
                           placeholder={'Введите имя...'}
                           className={'w-60 h-10 outline-none rounded-2xl px-2 border-2 border-primary'}
                           type="text"/>
                    <button className={'h-10 rounded-xl ml-4 bg-primary px-6'} onClick={() => {
                        addUserSubmit()
                    }}>Добавить
                    </button>
                </div>
                <div className={'mt-5'}>
                    {users && users?.length > 0 ?
                        <div>
                            <div className={'ml-5'}>Список пользователей:</div>
                            {users.map((user) => (
                                <div className={'text-xl overflow-hidden relative bg-primary rounded-xl mt-3 p-6'}
                                     onMouseEnter={() => {
                                         setHoverUser(user.id)
                                     }}
                                     onMouseLeave={() => {
                                         setHoverUser(0)
                                     }}
                                     onClick={()=>{navigate(`/user/${user.id}`)}}
                                     key={user.id}>
                                    <div className={'break-words'}>{user.name}</div>
                                    {user.id === hoverUser && <div
                                        onClick={(e)=>{e.stopPropagation(); RemoveUserSubmit(user.id)}}
                                        className={'cursor-pointer p-2 rounded-xl text-sm bg-bg absolute bottom-3 right-3'}>Удалить
                                    </div>}
                                </div>
                            ))}
                        </div> : <div>Нет пользователей</div>
                    }
                </div>
            </div>
            <div style={{width: '40%'}} className={'flex flex-col'}>
                <div  className={'flex justify-between'}>
                    <input value={nameValue}
                           onChange={(e) => {
                               setNameValue(e.target.value)
                           }}
                           onKeyPress={(event) => {
                               if (event.key === 'Enter') addTrackSubmit()
                           }}
                           placeholder={'Название трека...'}
                           className={'w-40 h-10 text-sm outline-none rounded-2xl px-2 border-2 border-secondary'}
                           type="text"/>
                    <input value={artistValue}
                           onChange={(e) => {
                               setArtistValue(e.target.value)
                           }}
                           onKeyPress={(event) => {
                               if (event.key === 'Enter') addTrackSubmit()
                           }}
                           placeholder={'Имя исполнителя...'}
                           className={'w-40 h-10 text-sm ml-4 outline-none rounded-2xl px-2 border-2 border-secondary'}
                           type="text"/>
                    <button className={'h-10 rounded-xl ml-4 bg-secondary px-6'} onClick={() => {
                        addTrackSubmit()
                    }}>Добавить
                    </button>
                </div>
                <div className={'mt-5'}>
                    {tracks && tracks?.length > 0 ?
                        <div>
                            <div className={'ml-5'}>Список треков:</div>
                            {tracks.map((track) => (
                                <div
                                    className={'overflow-hidden relative text-sm cursor-pointer bg-secondary rounded-xl mt-3 px-6 py-4'}
                                    onMouseEnter={() => {
                                        setHoverTrack(track.id)
                                    }}
                                    onMouseLeave={() => {
                                        setHoverTrack(0)
                                    }}
                                    onClick={()=>navigate('/track/' + track.id)}
                                    key={track.id}>
                                    <p className={'text-xl break-words'}>{track.name}</p>
                                    <p className={'text-sm break-words'}>{track.artist}</p>
                                    {track.id === hoverTrack &&
                                        <div
                                            onClick={(e)=>{e.stopPropagation();RemoveTrackSubmit(track.id)}}
                                            className={'cursor-pointer p-2 rounded-xl bg-bg absolute bottom-3 right-3'}>Удалить
                                        </div>}
                                </div>
                            ))}
                        </div> : <div>Нет треков</div>
                    }
                </div>
            </div>
        </div>
    )
        ;
};

export default MainPage;