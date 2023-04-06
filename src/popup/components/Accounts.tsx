import { Close, Login, PersonAdd } from '@mui/icons-material'
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  styled,
} from '@mui/material'
import { useEffect, useState } from 'react'
import browser, { Tabs } from 'webextension-polyfill'
import accountService, { Account } from '../../services/account'
import cookie from '../../services/cookie'
import rule from '../../services/rule'
import { isGitHubUrl, isNormalGitHubUrl, removeAccount } from '../../shared'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

function GitHubAvatar({ account }: { account: Account }) {
  const { name, active } = account
  const avatarUrl = account.avatarUrl ?? `https://github.com/${name}.png?size=100`
  const avatar = <Avatar src={avatarUrl} />

  if (active) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        {avatar}
      </StyledBadge>
    )
  }
  return avatar
}

async function getCurrentTab(): Promise<Tabs.Tab | undefined> {
  const queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await browser.tabs.query(queryOptions)
  return tab
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    accountService.getAll().then(setAccounts)
  }, [])

  async function handleLogin() {
    await cookie.clear()

    const tab = await getCurrentTab()
    const rules = await rule.getAll()

    if (isNormalGitHubUrl(tab?.url, rules)) {
      await browser.tabs.update(tab?.id!, {
        url: `https://github.com/login?return_to=${encodeURIComponent(tab?.url ?? '')}`,
      })
    } else if (isGitHubUrl(tab?.url)) {
      await browser.tabs.update(tab?.id!, { url: 'https://github.com/login' })
    } else {
      await browser.tabs.create({ url: 'https://github.com/login' })
    }

    window.close()
  }

  async function handleSwitch(username: string) {
    await accountService.switchTo(username)

    const tab = await getCurrentTab()
    const rules = await rule.getAll()

    // If the current tab is a normal GitHub page, reload it.
    if (isNormalGitHubUrl(tab?.url, rules)) {
      await browser.tabs.reload(tab?.id!)
    } else if (isGitHubUrl(tab?.url)) {
      await browser.tabs.update(tab?.id!, { url: 'https://github.com' })
    } else {
      await browser.tabs.create({ url: 'https://github.com' })
    }

    window.close()
  }

  async function handleRemove(accountName: string) {
    await removeAccount(accountName)
    setAccounts(accounts.filter((account) => account.name !== accountName))
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        You can manage your logged in accounts here.
      </Alert>
      <Box sx={{ mb: 1 }}>
        <List dense disablePadding>
          {accounts.map((account, i) => (
            <ListItem key={account.name} disableGutters divider={i !== accounts.length - 1}>
              <ListItemAvatar>
                <GitHubAvatar account={account} />
              </ListItemAvatar>
              <ListItemText
                primary={account.name}
                secondary={account.expiresAt && `Expires at ${account.expiresAt.toLocaleString()}`}
              />
              <ListItemSecondaryAction>
                <Tooltip title={`Switch to ${account.name}`}>
                  <span>
                    <IconButton
                      color="primary"
                      disabled={account.active}
                      onClick={() => handleSwitch(account.name)}
                    >
                      <Login />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip
                  title={`Remove ${account.name}`}
                  onClick={() => handleRemove(account.name)}
                >
                  <IconButton color="warning">
                    <Close />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
      <Button
        variant="contained"
        sx={{ textTransform: 'none' }}
        startIcon={<PersonAdd />}
        onClick={handleLogin}
      >
        Login Another Account
      </Button>
    </Box>
  )
}
