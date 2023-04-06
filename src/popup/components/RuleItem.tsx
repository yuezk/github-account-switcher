import { Close, Done, Edit } from '@mui/icons-material'
import { Box, IconButton, TextField, Tooltip } from '@mui/material'
import { useState } from 'react'
import { Rule } from '../../services/rule'

function isValidRegex(regex: string) {
  try {
    new RegExp(regex)
    return true
  } catch (error) {
    return false
  }
}

function isValidAccount(account: string) {
  return /^(?![-_])(?!.*[-_]{2})[A-Za-z0-9_-]+(?<![-_])$/g.test(account)
}

function validateUrlPattern(urlPattern: string): { valid: boolean; message?: string } {
  if (urlPattern.trim() === '') {
    return {
      valid: false,
      message: 'URL pattern is required',
    }
  }

  if (!isValidRegex(urlPattern)) {
    return {
      valid: false,
      message: 'Invalid regular expression',
    }
  }

  return {
    valid: true,
  }
}

function validateAccount(account: string): { valid: boolean; message?: string } {
  if (account.trim() === '') {
    return {
      valid: false,
      message: 'Account is required',
    }
  }

  if (!isValidAccount(account)) {
    return {
      valid: false,
      message: 'Invalid account',
    }
  }

  return {
    valid: true,
  }
}

type Props = {
  initialValue?: Rule
  mode?: 'view' | 'edit'
  onDone: (rule: Rule) => void
  onDelete: (rule: Rule) => void
}

export default function RuleItem(props: Props) {
  const { initialValue, mode, onDone, onDelete } = props
  const [rule, setRule] = useState<Rule>(
    initialValue ?? { id: Date.now(), urlPattern: '', account: '' },
  )
  const [isEditing, setIsEditing] = useState(mode === 'edit')
  const [urlPatternValidation, setUrlPatternValidation] = useState<string>()
  const [accountValidation, setAccountValidation] = useState<string>()

  function handleEdit() {
    setIsEditing(true)
  }

  function validate() {
    const urlPatternValidation = validateUrlPattern(rule.urlPattern)
    const accountValidation = validateAccount(rule.account)

    setUrlPatternValidation(urlPatternValidation.message)
    setAccountValidation(accountValidation.message)

    return urlPatternValidation.valid && accountValidation.valid
  }

  function handleDone() {
    if (!validate()) {
      return
    }
    setIsEditing(false)
    onDone(rule)
  }

  function handleDelete() {
    setIsEditing(false)
    onDelete(rule)
  }

  function handleUrlPatternChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const { message } = validateUrlPattern(value)
    setUrlPatternValidation(message)
    setRule({ ...rule, urlPattern: value })
  }

  function handleAccountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const { message } = validateAccount(value)
    setAccountValidation(message)
    setRule({ ...rule, account: value })
  }

  return (
    <Box display="flex" gap={2} alignItems="flex-start">
      <Box flex="1">
        <TextField
          size="medium"
          variant="standard"
          fullWidth
          placeholder="regular expression, e.g., /prefix-.+"
          error={!!urlPatternValidation}
          helperText={urlPatternValidation}
          value={rule.urlPattern}
          onChange={handleUrlPatternChange}
          autoFocus={isEditing}
          disabled={!isEditing}
        />
      </Box>
      <Box width={150} flexShrink={0}>
        <TextField
          size="medium"
          variant="standard"
          fullWidth
          placeholder="GitHub account"
          error={!!accountValidation}
          helperText={accountValidation}
          value={rule.account}
          onChange={handleAccountChange}
          disabled={!isEditing}
        />
      </Box>
      <Box display="flex" flexShrink={0}>
        {!isEditing && (
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={handleEdit}>
              <Edit />
            </IconButton>
          </Tooltip>
        )}
        {isEditing && (
          <Tooltip title="Done">
            <IconButton size="small" color="primary" onClick={handleDone}>
              <Done />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton size="small" color="warning" onClick={handleDelete}>
            <Close />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
