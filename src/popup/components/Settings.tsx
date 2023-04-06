import { People, Rule } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useState } from 'react'
import Accounts from './Accounts'
import AutoSwitchRules from './AutoSwitchRules'

type TabValue = 'rules' | 'accounts'

export default function Settings() {
  const [value, setValue] = useState<TabValue>('accounts')

  const handleChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setValue(newValue)
  }
  return (
    <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange}>
          <Tab
            icon={<People />}
            iconPosition="start"
            label="Accounts"
            value="accounts"
            sx={{ textTransform: 'none', minHeight: 50 }}
          />
          <Tab
            icon={<Rule />}
            iconPosition="start"
            label="Auto Switch Rules"
            value="rules"
            sx={{ textTransform: 'none', minHeight: 50 }}
          />
        </TabList>
      </Box>
      <TabPanel value="accounts">
        <Accounts />
      </TabPanel>
      <TabPanel value="rules">
        <AutoSwitchRules />
      </TabPanel>
    </TabContext>
  )
}
