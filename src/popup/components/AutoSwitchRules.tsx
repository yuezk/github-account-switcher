import { AddCircle } from '@mui/icons-material'
import { Alert, Box, Button, Link } from '@mui/material'
import { useEffect, useState } from 'react'
import ruleService, { Rule } from '../../services/rule'
import RuleItem from './RuleItem'

export default function AutoSwitchRules() {
  const [rules, setRules] = useState<Rule[]>([])
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    ruleService.getAll().then(setRules)
  }, [])

  function startAdding() {
    setIsAdding(true)
  }

  function stopAdding() {
    setIsAdding(false)
  }

  async function addRule(rule: Rule) {
    await ruleService.add(rule)
    setRules(await ruleService.getAll())
    stopAdding()
  }

  async function updateRule(rule: Rule) {
    await ruleService.update(rule)
    setRules(await ruleService.getAll())
  }

  async function removeRule(rule: Rule) {
    await ruleService.remove(rule.id)
    setRules(await ruleService.getAll())
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        When the request URL path matches the regular expression, the account will be switched to
        the specified account automatically,{' '}
        <Link
          href="https://github.com/yuezk/github-account-switcher#auto-switching"
          target="_blank"
        >
          see help
        </Link>
        .
      </Alert>

      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        sx={{
          '& > :last-child': {
            mb: 2,
          },
        }}
      >
        {rules.map((rule) => (
          <RuleItem key={rule.id} initialValue={rule} onDone={updateRule} onDelete={removeRule} />
        ))}
        {isAdding && <RuleItem mode="edit" onDone={addRule} onDelete={stopAdding} />}
      </Box>

      <Button
        variant="contained"
        startIcon={<AddCircle />}
        onClick={startAdding}
        disabled={isAdding}
        sx={{ textTransform: 'none' }}
      >
        Add a Rule
      </Button>
    </Box>
  )
}
