import { useParams, useHistory } from 'react-router-dom'

// import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'

import LogoImg from '../assets/images/logo.svg'
import DeleteImg from '../assets/images/delete.svg'
import CheckImg from '../assets/images/check.svg'
import AnswerImg from '../assets/images/answer.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja deletar essa pergunta ?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={CheckImg} alt="Marcar pergunta como respondia" />
                  </button>

                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={AnswerImg} alt="Dar destaque a pergunta" />
                  </button>
                </>
              )}

              <button
                className={`like-button ${question.likeId ? 'liked' : ''}`}
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={DeleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
