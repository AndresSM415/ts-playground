import {useEffect, useState} from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function App() {
    const [totalSpent, setTotalSpent] = useState(0)

    useEffect(() => {
        async function fetchTotal() {
            const res = await fetch('/api/expenses/total-spent')
            // const res2 = await fetch('/api/expenses/1')
            const data = await res.json()
            console.log("data")
            setTotalSpent(data.total)
        }
        fetchTotal()
    }, [])
    return (
        <Card className="w-[350px] m-auto">
            <CardHeader>
                <CardTitle>Total Spent</CardTitle>
                <CardDescription>The total amount you've spent.</CardDescription>
            </CardHeader>
            <CardContent>{totalSpent}</CardContent>
        </Card>
    )
}

export default App
