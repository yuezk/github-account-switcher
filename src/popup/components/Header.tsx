import { GitHub } from '@mui/icons-material'
import { Avatar, Container, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import logo from '../../assets/logo.png'

export default function Header() {
  const [active, setActive] = useState(false)

  function handleClick() {
    setActive(!active)
  }
  return (
    <Container
      component="header"
      sx={{
        py: 1,
        borderBottom: 1,
        borderBottomColor: 'divider',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography
        display="flex"
        alignItems="center"
        variant="h6"
        component="h1"
        flex="1"
        fontWeight="bold"
      >
        <Avatar
          src={logo}
          variant="square"
          className={active ? 'active' : ''}
          onClick={handleClick}
          sx={{
            mr: 2,
            width: 32,
            height: 32,
            transform: 'rotate(0turn)',
            transition: 'transform 0.5s ease-in-out',
            '&.active': {
              transform: 'rotate(-10turn)',
            },
          }}
        />
        GitHub Account Switcher
      </Typography>

      <IconButton
        size="small"
        href="https://github.com/yuezk/github-account-switcher"
        target="_blank"
      >
        <GitHub />
      </IconButton>
    </Container>
  )
}
