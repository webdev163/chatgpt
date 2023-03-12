import { FC, useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import send from './assets/send.svg'
import Loader from './Loader'
import axios from 'axios'

import './App.css'

interface data {
  isAI: boolean
  value: string
  uniqueId?: string
}

const App: FC = () => {
  const [searchReq, setSearchReq] = useState('')
  // const [response, setResponse] = useState('')
  const [dataArr, setDataArr] = useState<data[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const generateUniqueId = () => {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimalString}`
  }

  const getData = async () => {
    try {
      setIsLoading(true)
      const prompt = searchReq
      setSearchReq('')
      const response = await axios<any>({
        method: 'POST',
        url: 'http://localhost:5000',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          prompt: prompt,
        },
      })
      const { data } = response
      const parsedData = data.bot.trim()
      const arr = dataArr;
      arr[arr.length - 1].value = parsedData
      setIsLoading(false)
      setDataArr(arr)
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    const uniqueId = generateUniqueId()
    setDataArr([
      ...dataArr,
      { isAI: false, value: searchReq },
      { isAI: true, value: '', uniqueId },
    ])
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (dataArr && searchReq) getData()
  }, [dataArr])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="outer">
      <div className="chat-container">
        {dataArr.map((el, i) => {
          return (
            <div key={i} className={cn('wrapper', el.isAI && 'ai')}>
              <div className="chat">
                <div className="profile">
                  <img src={el.isAI ? bot : user} alt="" />
                </div>
                <div className="message" id={el.uniqueId}>
                  {isLoading && el.isAI && i === dataArr.length - 1 ? (
                    <Loader />
                  ) : (
                    el.value
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={searchReq}
          onChange={(e) => setSearchReq(e.target.value)}
          ref={inputRef}
        ></input>
        <button type="submit">
          <img src={send} alt="" />
        </button>
      </form>
    </div>
  )
}

export default App
