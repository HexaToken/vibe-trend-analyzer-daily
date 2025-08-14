#!/usr/bin/env node

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const runCommand = (command, args = []) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { 
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true 
    });
    
    let stdout = '';
    let stderr = '';
    
    proc.stdout?.on('data', (data) => {
      stdout += data;
    });
    
    proc.stderr?.on('data', (data) => {
      stderr += data;
    });
    
    const timeout = setTimeout(() => {
      proc.kill();
      reject(new Error(`Command timed out: ${command}`));
    }, 30000);
    
    proc.on('close', (code) => {
      clearTimeout(timeout);
      resolve({ code, stdout, stderr });
    });
  });
};

const scanResults = {
  typecheck: null,
  lint: null,
  stylelint: null,
  security: null,
};

async function quickScan() {
  console.log('🔍 Running Quick Code Health Scan...\n');
  
  // TypeScript check
  console.log('📝 TypeScript Check...');
  try {
    const result = await runCommand('npx tsc --noEmit --skipLibCheck');
    scanResults.typecheck = result.code === 0 ? '✅ PASS' : `❌ FAIL (${result.stderr.slice(0, 200)}...)`;
  } catch (error) {
    scanResults.typecheck = `❌ ERROR: ${error.message}`;
  }
  
  // ESLint check (limited files)
  console.log('🔧 ESLint Check...');
  try {
    const result = await runCommand('npx eslint client/src/main.tsx client/src/App.tsx --quiet');
    scanResults.lint = result.code === 0 ? '✅ PASS' : `❌ FAIL (${result.stdout.slice(0, 200)}...)`;
  } catch (error) {
    scanResults.lint = `❌ ERROR: ${error.message}`;
  }
  
  // Stylelint check
  console.log('🎨 Stylelint Check...');
  try {
    const result = await runCommand('npx stylelint "client/src/styles/*.css" --quiet');
    scanResults.stylelint = result.code === 0 ? '✅ PASS' : `❌ FAIL (${result.stdout.slice(0, 200)}...)`;
  } catch (error) {
    scanResults.stylelint = `❌ ERROR: ${error.message}`;
  }
  
  // Security audit
  console.log('🔒 Security Audit...');
  try {
    const result = await runCommand('npm audit --audit-level=high --json');
    const audit = JSON.parse(result.stdout);
    scanResults.security = audit.metadata.vulnerabilities.total === 0 ? '✅ PASS' : `❌ ${audit.metadata.vulnerabilities.total} vulnerabilities`;
  } catch (error) {
    scanResults.security = `❌ ERROR: ${error.message}`;
  }
  
  // Generate report
  console.log('\n📊 SCAN RESULTS:');
  console.log('================');
  console.log(`TypeScript:     ${scanResults.typecheck}`);
  console.log(`ESLint:         ${scanResults.lint}`);
  console.log(`Stylelint:      ${scanResults.stylelint}`);
  console.log(`Security:       ${scanResults.security}`);
  console.log('\n🚀 Run "npm run full:scan" for complete analysis');
}

quickScan().catch(console.error);
