import  {useEffect, useState} from 'react';
import axios from "axios";
import {SERVER_URL} from "../CONSTS.js";
import {toast} from "react-hot-toast";
import Loader from "./Loader.jsx";
import {Plus, X} from "lucide-react";

// eslint-disable-next-line react/prop-types
const AllTags = ({addTagToTrack,closeAllTagsFunction}) => {
    const [isLoading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [tags, setTags] = useState([])

    useEffect(() => {
        async function Init() {
            setLoading(true)
            const res = await axios.get(`${SERVER_URL}/api/tags`).catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)
                setLoading(false)
                return
            })
            console.log(res)
            if (res.status === 200) {
                setTags(res.data)
            }
            setLoading(false)
        }

        Init()
    }, [])

    const createTag = async () => {
        if (inputValue.trim() === '') return;
        const res = await axios.post(`${SERVER_URL}/api/tags?text=${inputValue}`).catch((e) => {
            console.log(e)
            toast.error(e.response.data.message)
            return
        })

        if (res.status === 200) {
            toast.success('Tag created!')
            setTags(prevState => [res.data, ...prevState])
            setInputValue('')
        }
    }

    if (isLoading || !tags) return <div className={'h-dvh w-dvw flex justify-center items-center'}><Loader/></div>
    return (
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.75)"}}
             className={'h-dvh w-dvw fixed top-0 left-0 bottom-0 right-0 z-50 flex justify-center items-center'}>
            <div style={{width: '40%', height: '80%'}} className={'bg-bg  relative rounded-3xl p-7'}>
                <button className={'absolute top-2 right-2'} onClick={closeAllTagsFunction}><X/></button>
                <div className={'px-2 flex justify-between'}>
                    <input value={inputValue}
                           onChange={(e) => {
                               setInputValue(e.target.value)
                           }}
                           onKeyPress={(event) => {
                               if (event.key === 'Enter') createTag()
                           }}
                           placeholder={'Введите название тега...'}
                           className={'w-60 h-10 outline-none text-sm rounded-2xl px-2 border-2 border-primary'}
                           type="text"/>

                    <button onClick={()=>createTag()} className={'bg-primary px-6 h-10 rounded-xl'}>Создать новый тег</button>
                </div>
                {tags.length > 0 ?
                    <div className={'h-full mt-5'}>
                        <div className={'ml-4'}>Все теги:</div>
                        <div style={{height: '85%'}} className={'overflow-y-scroll'}>
                            {tags.map((tag) => (
                                <div key={tag.id} className={'mt-5 flex justify-between items-center min-h-20 relative mx-2'}>
                                    <div className={'bg-primary  rounded-xl px-3 py-5 w-full h-full overflow-x-hidden'}>
                                        <p className={'text-xl break-words'}>{tag.text}</p>
                                    </div>
                                    <button
                                        onClick={()=>{addTagToTrack(tag.id)}}
                                        className={'h-16 w-20 ml-4 rounded-2xl flex items-center justify-center bg-primary border'}><Plus/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <div className={'mt-5'}>Нет созданных треков</div>
                }

            </div>
        </div>
    );
};

export default AllTags;