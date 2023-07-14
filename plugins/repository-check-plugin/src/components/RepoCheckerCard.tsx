import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button } from '@material-ui/core';
import { RepoChecker } from '../RepoChecker';

type RepoCheckerCardProps = {
  accessToken: string;
};

export const RepoCheckerCard = ({ accessToken }: RepoCheckerCardProps) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  
  const handleCheck = async () => {
    const checker = new RepoChecker(accessToken);
    const exists = await checker.checkRepository(owner, repo);
    setResult(exists);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Check Repository</Typography>
        <TextField
          label="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleCheck}>
          Check
        </Button>
        {result !== null && (
          <Typography variant="body2" color={result ? 'textPrimary' : 'error'}>
            {result ? 'Repository exists' : 'Repository does not exist'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};