import { FC, useState, useRef, useEffect } from 'react'
import cn from 'classnames'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import Loader from './Loader'
import axios from 'axios'

import './App.css'

interface data {
  isAI: boolean
  value: string
  uniqueId?: string
}

const App: FC = () => {
  const [searchReq, setSearchReq] = useState<string>('')
  const [dataArr, setDataArr] = useState<data[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScroll = (): void => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  const handleFocus = (): void => {
    inputRef.current?.focus()
  }

  const generateUniqueId = (): string => {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)
    return `id-${timestamp}-${hexadecimalString}`
  }

  const getData = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const prompt = searchReq
      const response = await axios<{ bot: string }>({
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
      const arr = dataArr
      arr[arr.length - 1].value = parsedData
      setDataArr(arr)
      setSearchReq('')
      setTimeout(() => {
        handleScroll()
        handleFocus()
      }, 100);
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e?.preventDefault()
    if (!searchReq || isLoading) return
    const uniqueId = generateUniqueId()
    setDataArr([
      ...dataArr,
      { isAI: false, value: searchReq },
      { isAI: true, value: '', uniqueId },
    ])
  }

  useEffect(() => {
    if (dataArr && searchReq) {
      handleScroll()
      getData()
    }
  }, [dataArr])

  useEffect(() => {
    handleFocus()
  }, [])

  return (
    <div className="outer">
      <div className="chat-container" ref={chatContainerRef}>
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
      <form onSubmit={handleSubmit} className="form">
        <input
          name="prompt"
          value={searchReq}
          onChange={(e) => setSearchReq(e.target.value)}
          className="input"
          ref={inputRef}
          disabled={isLoading}
        ></input>
        <button
          type="submit"
          className={cn('submitBtn', isLoading && 'disabled')}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default App
