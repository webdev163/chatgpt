import { FC, useState } from 'react'
import cn from 'classnames'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import send from './assets/send.svg'
import Loader from './Loader'

import './App.css'

interface data {
  isAI: boolean;
  value: string;
  uniqueId?: string;
}

const App: FC = () => {
  const [searchReq, setSearchReq] = useState('')
  const [dataArr, setDataArr] = useState<data[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateUniqueId = () => {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimalString}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uniqueId = generateUniqueId()
    setDataArr([
      ...dataArr,
      { isAI: false, value: searchReq },
      { isAI: true, value: ' ', uniqueId },
    ])
    setSearchReq('')
    setIsLoading(true)
  }

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
                  {isLoading && el.isAI ? <Loader /> : el.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          cols={1}
          rows={1}
          value={searchReq}
          onChange={(e) => setSearchReq(e.target.value)}
        ></textarea>
        <button type="submit">
          <img src={send} alt="" />
        </button>
      </form>
    </div>
  )
}

export default App
