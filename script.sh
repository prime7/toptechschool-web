#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
if [[ "$VERCEL_GIT_COMMIT_REF" == "main"  ]] ; then
  echo "✅ - Build can proceed"
  exit 0;

else
  echo "🛑 - Build cancelled"
  exit 1;
fi