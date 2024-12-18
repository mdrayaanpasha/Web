import { useEffect, useState } from "react"

export default function BillRepo(){
    const [interface1,setInterface1] = useState(true)
    const [interface2,setInterface2] = useState(false)

    const [selectedDate,setSelectedDate] = useState('null')

    useEffect(()=>{
        const d = new Date(selectedDate)
        const month = d.getMonth()+1;
        const day = d.getDay();
        const year = d.getFullYear();
        console.log(month,year,day)
    },[selectedDate])

    return(
        <>
        <input type="date" name="date" onChange={e=>setSelectedDate(e.target.value)} id="" />
        </>
    )
}