import Fuse from 'fuse.js'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import styled from 'styled-components'

// @ts-expect-error
const APPLETS = import.meta.compileTime('../compile-hook.ts') as string[]
const fuse = new Fuse(APPLETS, { isCaseSensitive: false, includeMatches: true })

const Container = styled.div`
  width: 90vw;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  padding: 0;
  margin: 0;
`

const ListItem = styled.li`
  padding: 0;
  margin: 0;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`

const Search = styled.input`
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
`

const Link = styled.a`
  display: block;
  text-decoration: none;
  color: #000;
  font-size: 20px;
  font-weight: 600;
  padding: 10px 40px;
`

interface AppletListItemData {
  name: string
  matches: readonly Fuse.FuseResultMatch[] | undefined
}

const Highlight: FC<{ text: string; matches: readonly Fuse.FuseResultMatch[] | undefined }> = ({
  text,
  matches,
}) => {
  if (matches == null) return <>{text}</>

  let lastIndex = 0
  const elements = []
  for (const match of matches) {
    elements.push(<>{text.slice(lastIndex, match.indices[0][0])}</>)
    lastIndex = match.indices[0][1] + 1
    elements.push(
      <span style={{ backgroundColor: 'yellow' }}>
        {text.slice(match.indices[0][0], lastIndex)}
      </span>,
    )
  }
  elements.push(<>{text.slice(lastIndex)}</>)

  return <>{elements}</>
}

export const AppletList: FC = () => {
  const [applets, setApplets] = useState<Array<AppletListItemData>>([])
  const [search, setSearch] = useState('')

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if (search === '') {
      setApplets(APPLETS.map((app) => ({ name: app, matches: undefined })))
    } else {
      setApplets(
        fuse.search(search).map((results) => ({ name: results.item, matches: results.matches })),
      )
    }
  }, [search])

  return (
    <Container>
      <Search type="text" placeholder="Search Applets" onChange={onSearch} />
      <List>
        {applets.map(({ name, matches }) => (
          <ListItem key={name}>
            <Link href={`?appletId=${name}`}>
              <Highlight text={name} matches={matches} />
            </Link>
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
