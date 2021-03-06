import { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'

function useFetch(url, isCovidData) {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    //lấy data về
    //async là tín hiệu báo cho thằng js biết là đang muốn sd async await hay là cái func này là 1 promises 
    useEffect(() => {

        const ourRequest = axios.CancelToken.source() //tạo token để xác định request như là id, để xác định cái muốn cancel
        async function fetchData() {
            try {

                let res = await axios.get(url, {
                    cancelToken: ourRequest.token //params thứ 2
                })
                let data = res && res.data ? res.data : []
                //nếu ..., ? là thì, : là else
                //đặt tên biến là data, và nếu nó có phản hồi về và phản hồi có biến data và có dữ liệu của cục res.data
                //thì sẽ lấy dữ liệu cục ấy còn nếu lỗi thì sẽ gán gtri bằng 1 mảng rỗng
                if (data && data.length > 0 && isCovidData === true) {
                    //tham số true bên Covid.js chỉ ra rằng nó có phải data của covid k, đúng thì fomat lại data
                    data.map(item => {
                        item.Date = moment(item.Date).format('DD-MM-YYYY')
                        return item
                    })
                    data = data.reverse()
                }
                setData(data) //sau khi có biến data gán ngược giá trị vào cái covid thông qua setCovid(ứng dụng useState)
                setLoading(false)
                setError(false)
            }
            catch (error) {
                if (axios.isCancel(error)) { //Cancel Request Axios
                    console.log('Request canceled', error.message)
                } else {
                    setError(true)
                    setLoading(false)
                }
            }
        }
        setTimeout(() => {
            fetchData()
        }, 3000)
        return () => {
            ourRequest.cancel('Operation canceled by the user')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])
    //để cho hàm này chỉ chạy 1 lần nên truyền vào 1 cái dependence []
    return {
        data, loading, error
    }
}

export default useFetch