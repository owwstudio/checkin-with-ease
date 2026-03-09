#!/usr/bin/env python3
"""
Vibe Coding Merge Analyzer
===========================
Analyzes agent.md and mistake.md files to help main branch
decide which implementation to merge.

Usage:
    python merge_analyzer.py --dev1 branch-dev1 --dev2 branch-dev2
    python merge_analyzer.py --compare all
    python merge_analyzer.py --report branch-dev1
"""

import os
import re
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Dict, List, Tuple, Optional
from collections import defaultdict


@dataclass
class AgentMetrics:
    """Metrics extracted from agent.md"""
    developer: str
    sessions_completed: int
    features_implemented: int
    features_status: Dict[str, str]
    code_coverage: int
    eslint_errors: int
    complexity_score: float
    bundle_impact_kb: int
    test_cases_completed: int
    blockers_count: int
    blockers_resolved: int
    design_decisions: int
    last_update: str
    merge_ready: bool
    confidence_level: str


@dataclass
class MistakeMetrics:
    """Metrics extracted from mistake.md"""
    developer: str
    total_issues: int
    critical_bugs: int
    high_priority_issues: int
    medium_priority_issues: int
    low_priority_issues: int
    bugs_fixed: int
    patterns_identified: int
    test_gaps: int
    refactoring_items: int
    bug_severity_score: float  # Lower is better


class AgentAnalyzer:
    """Parses and analyzes agent.md files"""
    
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.content = self._read_file()
        self.metrics = self._extract_metrics()
    
    def _read_file(self) -> str:
        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"❌ File not found: {self.filepath}")
            return ""
    
    def _extract_metrics(self) -> AgentMetrics:
        """Extract key metrics from agent.md"""
        
        # Extract developer name
        developer = self._extract_field(r'Developer:\*\*\s*(.+?)(?:\n|$)')
        
        # Count sessions
        sessions = len(re.findall(r'### SESSION \d+:', self.content))
        
        # Count features
        features = re.findall(r'### Feature \d+:\s*\[(.+?)\]', self.content)
        features_list = {}
        for feature in features:
            status_match = re.search(f'Feature.*{re.escape(feature)}.*Status.*?(✅|🔄|🚫)', self.content)
            status = status_match.group(1) if status_match else '?'
            features_list[feature] = status
        
        # Extract metrics
        coverage = self._extract_number(r'Code Coverage.*?(\d+)%')
        eslint_errors = self._extract_number(r'ESLint Errors.*?(\d+)')
        complexity = self._extract_number(r'Complexity \(avg\).*?(\d+(?:\.\d+)?)')
        bundle = self._extract_number(r'Bundle Impact.*?([\d.]+)\s*(?:KB|kb)')
        tests = self._extract_number(r'Test Coverage.*?(\d+)')
        
        # Count blockers
        blockers = len(re.findall(r'Issue \d+:', self.content))
        blockers_resolved = len(re.findall(r'Status:.*?✅ Resolved', self.content))
        
        # Count design decisions
        decisions = len(re.findall(r'\d+\.\s+Decision:', self.content))
        
        # Extract last update
        last_update = self._extract_field(r'Last Updated:\*\*\s*(.+?)(?:\n|$)', 'Unknown')
        
        # Check merge readiness
        merge_ready = '✅ Yes' in self.content or '✅' in self.content.split('MERGE READINESS')[-1].split('---')[0] if 'MERGE READINESS' in self.content else False
        
        # Extract confidence level
        confidence = self._extract_field(r'Confidence Level.*?(💪|😊|🤔)\s+(.+?)(?:\n|$)', '???')
        
        return AgentMetrics(
            developer=developer,
            sessions_completed=sessions,
            features_implemented=len(features),
            features_status=features_list,
            code_coverage=coverage if coverage >= 0 else 0,
            eslint_errors=eslint_errors if eslint_errors >= 0 else 0,
            complexity_score=float(complexity) if complexity >= 0 else 0,
            bundle_impact_kb=int(bundle) if bundle >= 0 else 0,
            test_cases_completed=tests if tests >= 0 else 0,
            blockers_count=blockers,
            blockers_resolved=blockers_resolved,
            design_decisions=decisions,
            last_update=last_update,
            merge_ready=merge_ready,
            confidence_level=confidence
        )
    
    def _extract_field(self, pattern: str, default: str = 'Unknown') -> str:
        match = re.search(pattern, self.content, re.IGNORECASE)
        return match.group(1).strip() if match else default
    
    def _extract_number(self, pattern: str) -> float:
        match = re.search(pattern, self.content, re.IGNORECASE)
        try:
            return float(match.group(1)) if match else -1
        except (ValueError, AttributeError):
            return -1


class MistakeAnalyzer:
    """Parses and analyzes mistake.md files"""
    
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.content = self._read_file()
        self.metrics = self._extract_metrics()
    
    def _read_file(self) -> str:
        try:
            with open(self.filepath, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"⚠️  File not found: {self.filepath}")
            return ""
    
    def _extract_metrics(self) -> MistakeMetrics:
        """Extract key metrics from mistake.md"""
        
        # Extract developer name
        developer = self._extract_field(r'Developer:\*\*\s*(.+?)(?:\n|$)')
        
        # Count bugs by severity
        critical = len(re.findall(r'### Bug \d+:|🔴 Critical', self.content))
        high = len(re.findall(r'### Issue \d+:.*?🟠 High', self.content, re.DOTALL))
        medium = len(re.findall(r'🟡 Medium', self.content))
        low = len(re.findall(r'🟢 Low', self.content))
        
        # Count fixed bugs
        fixed = len(re.findall(r'Status:.*?✅ Fixed', self.content))
        
        # Count patterns identified
        patterns = len(re.findall(r'Pattern:', self.content))
        
        # Count test gaps
        test_gaps = len(re.findall(r'### Gap \d+:', self.content))
        
        # Count refactoring items
        refactoring = len(re.findall(r'#### Item \d+:', self.content))
        
        # Calculate severity score (higher = worse)
        severity_score = (critical * 100) + (high * 50) + (medium * 10) + (low * 1)
        
        return MistakeMetrics(
            developer=developer,
            total_issues=critical + high + medium + low,
            critical_bugs=critical,
            high_priority_issues=high,
            medium_priority_issues=medium,
            low_priority_issues=low,
            bugs_fixed=fixed,
            patterns_identified=patterns,
            test_gaps=test_gaps,
            refactoring_items=refactoring,
            bug_severity_score=severity_score
        )
    
    def _extract_field(self, pattern: str, default: str = 'Unknown') -> str:
        match = re.search(pattern, self.content, re.IGNORECASE)
        return match.group(1).strip() if match else default


class MergeEvaluator:
    """Compares and evaluates different branches for merging"""
    
    def __init__(self):
        self.branches: Dict[str, Tuple[AgentMetrics, MistakeMetrics]] = {}
        self.scores: Dict[str, float] = {}
    
    def add_branch(self, branch_name: str, agent_file: str, mistake_file: str):
        """Add a branch to evaluate"""
        agent = AgentAnalyzer(agent_file).metrics
        mistake = MistakeAnalyzer(mistake_file).metrics
        self.branches[branch_name] = (agent, mistake)
    
    def calculate_score(self, branch_name: str) -> float:
        """Calculate overall merge quality score"""
        agent, mistake = self.branches[branch_name]
        
        # Component scores (0-100)
        coverage_score = min(100, agent.code_coverage)  # Target 80%
        quality_score = max(0, 100 - (agent.eslint_errors * 10) - (agent.complexity_score * 2))
        bug_score = max(0, 100 - (mistake.bug_severity_score / 10))
        testing_score = min(100, agent.test_cases_completed * 2)
        blockers_score = max(0, 100 - (mistake.critical_bugs * 20))
        
        # Weighted average
        total_score = (
            coverage_score * 0.25 +
            quality_score * 0.25 +
            bug_score * 0.20 +
            testing_score * 0.15 +
            blockers_score * 0.15
        )
        
        self.scores[branch_name] = total_score
        return total_score
    
    def compare_branches(self) -> Dict:
        """Compare all branches and generate recommendation"""
        
        # Calculate scores
        for branch in self.branches:
            self.calculate_score(branch)
        
        # Sort by score
        sorted_branches = sorted(self.scores.items(), key=lambda x: x[1], reverse=True)
        
        return {
            'ranking': sorted_branches,
            'recommendation': sorted_branches[0][0] if sorted_branches else None,
            'reason': self._generate_reason(sorted_branches[0][0])
        }
    
    def _generate_reason(self, branch_name: str) -> str:
        """Generate recommendation reason"""
        agent, mistake = self.branches[branch_name]
        reasons = []
        
        if agent.code_coverage >= 80:
            reasons.append(f"✅ Good test coverage ({agent.code_coverage}%)")
        
        if agent.eslint_errors == 0:
            reasons.append("✅ Clean code (no ESLint errors)")
        
        if mistake.critical_bugs == 0:
            reasons.append("✅ No critical bugs")
        
        if agent.complexity_score < 10:
            reasons.append(f"✅ Low complexity ({agent.complexity_score:.1f})")
        
        return " | ".join(reasons) if reasons else "Higher overall score"
    
    def generate_report(self) -> str:
        """Generate detailed evaluation report"""
        report = []
        report.append("=" * 80)
        report.append("🔀 MERGE EVALUATION REPORT")
        report.append("=" * 80)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        # Branch comparison table
        report.append("📊 BRANCH SCORES\n")
        report.append(f"{'Branch':<20} {'Score':<10} {'Dev':<20} {'Status':<15}")
        report.append("-" * 65)
        
        for branch in sorted(self.scores.keys(), key=lambda x: self.scores[x], reverse=True):
            agent, _ = self.branches[branch]
            score = self.scores[branch]
            status = "✅ Ready" if score >= 80 else "⚠️  Review" if score >= 60 else "❌ Needs Work"
            report.append(f"{branch:<20} {score:>6.1f}% {agent.developer:<20} {status:<15}")
        
        report.append("\n")
        
        # Detailed metrics
        report.append("📈 DETAILED METRICS\n")
        for branch in self.branches:
            agent, mistake = self.branches[branch]
            report.append(f"\n{'—' * 40}")
            report.append(f"Branch: {branch}")
            report.append(f"Developer: {agent.developer}")
            report.append(f"{'—' * 40}")
            report.append(f"Code Coverage:       {agent.code_coverage}%")
            report.append(f"ESLint Errors:       {agent.eslint_errors}")
            report.append(f"Complexity Score:    {agent.complexity_score:.1f}")
            report.append(f"Test Cases:          {agent.test_cases_completed}")
            report.append(f"Critical Bugs:       {mistake.critical_bugs}")
            report.append(f"High Priority Issues: {mistake.high_priority_issues}")
            report.append(f"Bugs Fixed:          {mistake.bugs_fixed}/{mistake.total_issues}")
            report.append(f"Merge Ready:         {'✅ Yes' if agent.merge_ready else '❌ No'}")
        
        report.append("\n")
        
        # Recommendation
        comparison = self.compare_branches()
        report.append("🏆 RECOMMENDATION\n")
        report.append(f"Recommended for merge: {comparison['recommendation']}")
        report.append(f"Reason: {comparison['reason']}")
        
        report.append("\n" + "=" * 80)
        
        return "\n".join(report)


def main():
    parser = argparse.ArgumentParser(
        description='Analyze and compare vibe coding branches'
    )
    parser.add_argument('--dev1', help='Path to dev1 branch directory')
    parser.add_argument('--dev2', help='Path to dev2 branch directory')
    parser.add_argument('--report', help='Generate report for specific branch')
    parser.add_argument('--compare', help='Compare all branches', nargs='?', const='all')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    
    args = parser.parse_args()
    
    evaluator = MergeEvaluator()
    
    # Add branches if specified
    if args.dev1:
        agent_file = os.path.join(args.dev1, 'agent.md')
        mistake_file = os.path.join(args.dev1, 'mistake.md')
        evaluator.add_branch('branch-dev1', agent_file, mistake_file)
    
    if args.dev2:
        agent_file = os.path.join(args.dev2, 'agent.md')
        mistake_file = os.path.join(args.dev2, 'mistake.md')
        evaluator.add_branch('branch-dev2', agent_file, mistake_file)
    
    # Generate output
    if args.json:
        output = {
            'scores': evaluator.scores,
            'recommendation': evaluator.compare_branches()
        }
        print(json.dumps(output, indent=2))
    else:
        print(evaluator.generate_report())


if __name__ == '__main__':
    main()