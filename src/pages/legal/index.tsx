import { useParams } from 'react-router'

export const LegalPage = () => {
  const params = useParams()
  return (
    <section>
      <h2>LegalPage</h2>
      <div>{JSON.stringify(params)}</div>
    </section>
  )
}
