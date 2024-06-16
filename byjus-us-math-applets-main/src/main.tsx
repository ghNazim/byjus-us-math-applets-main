import React from 'react'
import ReactDOM from 'react-dom/client'
import styled from 'styled-components'

import { useRemoteComponent } from '@/hooks/useRemoteComponent'

import { AppletList } from './applets/AppletList'

const Wrapper = styled.div`
  width: 90dvw;
  height: 90dvh;
  margin: auto;
`

function getRemoteApplet(id: string) {
  const RemoteApplet = (props: any) => {
    const [isLoading, error, Component] = useRemoteComponent(id, 'Applet')

    if (isLoading) return <div style={{ color: 'black' }}>Loading...</div>

    if (error != null)
      return (
        <div style={{ color: 'red' }}>
          {error.message}
          <br />
          {error.stack}
        </div>
      )

    return <Component {...props} />
  }

  return RemoteApplet
}

// get the applet id from the search params
const appletId = new URLSearchParams(window.location.search).get('appletId')

if (appletId == null) {
  // List all the applet urls -
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <AppletList />
    </React.StrictMode>,
  )
} else {
  let Applet
  if (import.meta.env.DEV) {
    const module = await import(`./applets/${appletId}/index.ts`)
    Applet = module.Applet
  } else {
    Applet = getRemoteApplet(appletId)
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <Wrapper>
        <Applet
          onEvent={(appletId: any, typeOfInteraction: any) =>
            // eslint-disable-next-line no-console
            console.log(`[${appletId}]: Performed interaction - ${typeOfInteraction}`)
          }
        />
      </Wrapper>
    </React.StrictMode>,
  )
}
