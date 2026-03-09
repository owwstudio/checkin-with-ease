#!/usr/bin/env python3
"""
Vibe Coding Merge Analyzer - Project-Wide Integration
=====================================================
Analyzes agent.md and mistake.md files across all branches
to help main branch consolidate the best implementations.

Usage - Legacy (compare 2 branches):
    python merge_analyzer.py --dev1 branch-dev1 --dev2 branch-dev2
    python merge_analyzer.py --compare all

Usage - New (project-wide):
    python merge_analyzer.py --project-scan
    python merge_analyzer.py --full-report
    python merge_analyzer.py --generate-roadmap
"""

import os
import re
import sys
import json
import argparse
import subprocess
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, asdict, field
from typing import Dict, List, Tuple, Optional, Set
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


@dataclass
class ProjectMetrics:
    """Aggregated metrics across all branches"""
    branches: Dict[str, Tuple[AgentMetrics, MistakeMetrics]] = field(default_factory=dict)
    features_by_branch: Dict[str, List[str]] = field(default_factory=dict)
    best_implementations: Dict[str, str] = field(default_factory=dict)
    conflicts: List[Dict] = field(default_factory=list)
    branches_discovered: List[str] = field(default_factory=list)


@dataclass
class MergeRecommendation:
    """Recommendation for merging a branch into main"""
    branch: str
    features: List[str] = field(default_factory=list)
    priority: int = 1
    estimated_coverage_gain: float = 0.0
    estimated_bug_reduction: float = 0.0
    risk_level: str = "Medium"
    specific_learnings: List[str] = field(default_factory=list)
    score: float = 0.0


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


class ProjectDiscovery:
    """Discovers and collects metrics from all branches in a project"""

    def __init__(self, project_root: str):
        self.project_root = project_root
        self.git_root = self._find_git_root()
        self.branches_found: Dict[str, str] = {}
        self.metrics: ProjectMetrics = ProjectMetrics()

    def _find_git_root(self) -> str:
        """Find the git root directory"""
        try:
            result = subprocess.run(
                ['git', 'rev-parse', '--show-toplevel'],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            return result.stdout.strip() if result.returncode == 0 else self.project_root
        except Exception:
            return self.project_root

    def discover_branches(self) -> Dict[str, str]:
        """Discover all git branches and worktrees"""
        branches = {}

        try:
            # Get regular branches
            result = subprocess.run(
                ['git', 'branch', '-a'],
                cwd=self.git_root,
                capture_output=True,
                text=True
            )

            for line in result.stdout.split('\n'):
                line = line.strip()
                # Remove git decorations (*, +, etc.)
                if line and not line.startswith('*'):
                    # Clean up branch name
                    branch_name = line.lstrip('+ ').strip()
                    branch_name = branch_name.replace('remotes/origin/', '').replace('origin/', '')

                    # Skip if we already have this branch (avoid duplicates)
                    if branch_name and branch_name not in branches:
                        branches[branch_name] = self.git_root
        except Exception as e:
            print(f"⚠️  Could not discover regular branches: {e}")

        # Check for worktrees
        worktree_dir = os.path.join(self.git_root, '.claude', 'worktrees')
        if os.path.exists(worktree_dir):
            for worktree_name in os.listdir(worktree_dir):
                worktree_path = os.path.join(worktree_dir, worktree_name)
                if os.path.isdir(worktree_path):
                    try:
                        result = subprocess.run(
                            ['git', 'branch', '--show-current'],
                            cwd=worktree_path,
                            capture_output=True,
                            text=True
                        )
                        branch_name = result.stdout.strip()
                        if branch_name:
                            branches[branch_name] = worktree_path
                    except Exception:
                        pass

        self.branches_found = branches
        return branches

    def collect_branch_files(self) -> ProjectMetrics:
        """Collect agent.md and mistake.md from all branches"""
        if not self.branches_found:
            self.discover_branches()

        for branch_name, branch_path in self.branches_found.items():
            agent_file = os.path.join(branch_path, 'agent.md')
            mistake_file = os.path.join(branch_path, 'mistake.md')

            # Try different common names for mistake file
            if not os.path.exists(mistake_file):
                mistake_file = os.path.join(branch_path, 'MISTAKE.md')

            if os.path.exists(agent_file):
                agent = AgentAnalyzer(agent_file).metrics
                mistake = MistakeAnalyzer(mistake_file).metrics if os.path.exists(mistake_file) else None

                self.metrics.branches[branch_name] = (agent, mistake)
                self.metrics.branches_discovered.append(branch_name)

        return self.metrics

    def build_metrics_database(self) -> ProjectMetrics:
        """Build complete project metrics database"""
        if not self.metrics.branches_discovered:
            self.collect_branch_files()

        return self.metrics


class FeatureAnalyzer:
    """Analyzes features across branches to identify best implementations"""

    def __init__(self, project_metrics: ProjectMetrics):
        self.metrics = project_metrics
        self.features_by_branch: Dict[str, List[str]] = {}
        self.best_implementations: Dict[str, str] = {}

    def extract_features_by_branch(self) -> Dict[str, List[str]]:
        """Map features to branches that implemented them"""
        for branch_name, (agent, _) in self.metrics.branches.items():
            if agent:
                features = list(agent.features_status.keys())
                self.features_by_branch[branch_name] = features

        return self.features_by_branch

    def identify_best_implementation(self) -> Dict[str, str]:
        """Find highest-quality version of each feature"""
        all_features = set()
        for features in self.features_by_branch.values():
            all_features.update(features)

        for feature in all_features:
            best_branch = None
            best_score = -1

            for branch_name, (agent, mistake) in self.metrics.branches.items():
                if agent and feature in agent.features_status:
                    score = self._calculate_feature_score(agent, mistake)
                    if score > best_score:
                        best_score = score
                        best_branch = branch_name

            if best_branch:
                self.best_implementations[feature] = best_branch

        return self.best_implementations

    def _calculate_feature_score(self, agent: AgentMetrics, mistake: Optional[MistakeMetrics]) -> float:
        """Calculate quality score for feature implementation"""
        score = 0.0
        score += agent.code_coverage
        score -= agent.eslint_errors * 10
        score -= agent.complexity_score * 2

        if mistake:
            score -= (mistake.bug_severity_score / 10)

        return max(0, score)

    def detect_conflicts_and_duplication(self) -> List[Dict]:
        """Find overlapping implementations"""
        conflicts = []

        for feature in self.features_by_branch.values():
            for f in feature:
                branches_with_feature = [
                    b for b, fs in self.features_by_branch.items() if f in fs
                ]
                if len(branches_with_feature) > 1:
                    conflicts.append({
                        'feature': f,
                        'branches': branches_with_feature,
                        'best': self.best_implementations.get(f, '?')
                    })

        return conflicts


class OptimizationRecommender:
    """Generates recommendations for main branch optimization"""

    def __init__(self, project_metrics: ProjectMetrics, feature_analyzer: FeatureAnalyzer):
        self.metrics = project_metrics
        self.feature_analyzer = feature_analyzer
        self.recommendations: List[MergeRecommendation] = []

    def recommend_merge_candidates(self) -> List[MergeRecommendation]:
        """Score and rank branches for main adoption"""
        self.recommendations = []

        for branch_name, (agent, mistake) in self.metrics.branches.items():
            if branch_name == 'main':
                continue  # Skip main branch itself

            if not agent:
                continue

            score = self._calculate_branch_score(agent, mistake)
            features = list(agent.features_status.keys())

            recommendation = MergeRecommendation(
                branch=branch_name,
                features=features,
                score=score,
                priority=self._determine_priority(score),
                risk_level=self._assess_risk(agent, mistake),
                estimated_coverage_gain=max(0, 100 - agent.code_coverage),
                estimated_bug_reduction=0 if not mistake else mistake.bug_severity_score,
                specific_learnings=self._extract_learnings(agent, mistake)
            )

            self.recommendations.append(recommendation)

        # Sort by score (descending)
        self.recommendations.sort(key=lambda x: x.score, reverse=True)
        return self.recommendations

    def _calculate_branch_score(self, agent: AgentMetrics, mistake: Optional[MistakeMetrics]) -> float:
        """Calculate overall branch quality score"""
        coverage_score = min(100, agent.code_coverage)
        quality_score = max(0, 100 - (agent.eslint_errors * 10) - (agent.complexity_score * 2))
        bug_score = max(0, 100 - ((mistake.bug_severity_score / 10) if mistake else 0))
        testing_score = min(100, agent.test_cases_completed * 2)
        blockers_score = max(0, 100 - ((mistake.critical_bugs * 20) if mistake else 0))

        total_score = (
            coverage_score * 0.25 +
            quality_score * 0.25 +
            bug_score * 0.20 +
            testing_score * 0.15 +
            blockers_score * 0.15
        )

        return total_score

    def _determine_priority(self, score: float) -> int:
        """Convert score to priority (1-5, higher = merge first)"""
        if score >= 85:
            return 5
        elif score >= 70:
            return 4
        elif score >= 55:
            return 3
        elif score >= 40:
            return 2
        else:
            return 1

    def _assess_risk(self, agent: AgentMetrics, mistake: Optional[MistakeMetrics]) -> str:
        """Assess merge risk level"""
        if agent.eslint_errors > 5 or (mistake and mistake.critical_bugs > 2):
            return "High"
        elif agent.eslint_errors > 2 or (mistake and mistake.high_priority_issues > 1):
            return "Medium"
        else:
            return "Low"

    def _extract_learnings(self, agent: AgentMetrics, mistake: Optional[MistakeMetrics]) -> List[str]:
        """Extract key learnings from branch development"""
        learnings = []

        if agent.code_coverage >= 80:
            learnings.append(f"Strong test coverage ({agent.code_coverage}%)")
        if agent.eslint_errors == 0:
            learnings.append("Clean code quality")
        if agent.complexity_score < 10:
            learnings.append("Low complexity")
        if mistake and mistake.bugs_fixed > 0:
            learnings.append(f"Fixed {mistake.bugs_fixed} issues")
        if agent.design_decisions > 5:
            learnings.append("Well-documented decisions")

        return learnings

    def consolidate_learnings(self) -> Dict[str, List[str]]:
        """Extract shared patterns/lessons from all branches"""
        learnings_map = defaultdict(list)

        for rec in self.recommendations:
            for learning in rec.specific_learnings:
                learnings_map[learning].append(rec.branch)

        return dict(learnings_map)

    def generate_optimization_plan(self) -> Dict:
        """Create actionable main branch improvement plan"""
        return {
            'recommendations': [asdict(rec) for rec in self.recommendations],
            'consolidated_learnings': self.consolidate_learnings(),
            'total_branches_analyzed': len(self.metrics.branches),
            'merge_roadmap': [
                {
                    'order': i + 1,
                    'branch': rec.branch,
                    'priority': rec.priority,
                    'score': rec.score,
                    'features': rec.features
                }
                for i, rec in enumerate(self.recommendations[:5])
            ]
        }


class ConsolidatedReporter:
    """Generates comprehensive project-wide reports"""

    def __init__(self, metrics: ProjectMetrics, recommender: OptimizationRecommender):
        self.metrics = metrics
        self.recommender = recommender

    def generate_consolidated_report(self) -> str:
        """Generate project-wide optimization report"""
        report = []
        report.append("=" * 90)
        report.append("🔀 PROJECT-WIDE MERGE OPTIMIZATION REPORT")
        report.append("=" * 90)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

        # Project summary
        report.append("📊 PROJECT SUMMARY\n")
        report.append(f"Branches analyzed: {len(self.metrics.branches_discovered)}")
        report.append(f"Total features tracked: {sum(len(f) for f in self.recommender.feature_analyzer.features_by_branch.values())}")
        report.append(f"Merge recommendations: {len(self.recommender.recommendations)}\n")

        # Branch comparison table
        report.append("📈 BRANCH QUALITY SCORES\n")
        report.append(f"{'Branch':<30} {'Score':<10} {'Priority':<12} {'Risk':<10}")
        report.append("-" * 62)

        for rec in sorted(self.recommender.recommendations, key=lambda x: x.score, reverse=True):
            report.append(
                f"{rec.branch:<30} {rec.score:>6.1f}% {'★' * rec.priority:<10} {rec.risk_level:<10}"
            )

        report.append("\n")

        # Merge roadmap
        report.append("🛣️  RECOMMENDED MERGE SEQUENCE\n")
        plan = self.recommender.generate_optimization_plan()
        for item in plan['merge_roadmap']:
            report.append(f"{item['order']}. {item['branch']} (Priority: {item['priority']}, Score: {item['score']:.1f}%)")
            if item['features']:
                report.append(f"   Features: {', '.join(item['features'][:3])}")

        report.append("\n")

        # Consolidated learnings
        report.append("💡 KEY LEARNINGS\n")
        learnings = self.recommender.consolidate_learnings()
        for learning, branches in learnings.items():
            report.append(f"✅ {learning}")
            report.append(f"   From: {', '.join(branches[:2])}")

        report.append("\n" + "=" * 90)

        return "\n".join(report)

    def generate_merge_roadmap(self) -> Dict:
        """Generate merge strategy prioritization"""
        plan = self.recommender.generate_optimization_plan()

        roadmap = {
            'generated_at': datetime.now().isoformat(),
            'total_branches': len(self.metrics.branches_discovered),
            'merge_sequence': plan['merge_roadmap'],
            'consolidated_learnings': plan['consolidated_learnings'],
            'all_recommendations': plan['recommendations']
        }

        return roadmap


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
        description='Analyze and compare project branches for optimization'
    )

    # Legacy arguments
    parser.add_argument('--dev1', help='[Legacy] Path to dev1 branch directory')
    parser.add_argument('--dev2', help='[Legacy] Path to dev2 branch directory')
    parser.add_argument('--report', help='[Legacy] Generate report for specific branch')
    parser.add_argument('--compare', help='[Legacy] Compare all branches', nargs='?', const='all')

    # New project-wide arguments
    parser.add_argument('--project-scan', action='store_true',
                        help='Scan entire project for all branches and generate optimization report')
    parser.add_argument('--full-report', action='store_true',
                        help='Generate comprehensive optimization report with roadmap')
    parser.add_argument('--generate-roadmap', action='store_true',
                        help='Generate merge strategy prioritization as JSON')
    parser.add_argument('--project-root', default=os.getcwd(),
                        help='Project root directory (default: current directory)')
    parser.add_argument('--json', action='store_true', help='Output as JSON')

    args = parser.parse_args()

    # PROJECT-WIDE SCANNING MODE
    if args.project_scan or args.full_report or args.generate_roadmap:
        discovery = ProjectDiscovery(args.project_root)
        discovery.discover_branches()
        discovery.collect_branch_files()

        feature_analyzer = FeatureAnalyzer(discovery.metrics)
        feature_analyzer.extract_features_by_branch()
        feature_analyzer.identify_best_implementation()

        recommender = OptimizationRecommender(discovery.metrics, feature_analyzer)
        recommender.recommend_merge_candidates()

        if args.generate_roadmap:
            reporter = ConsolidatedReporter(discovery.metrics, recommender)
            roadmap = reporter.generate_merge_roadmap()
            print(json.dumps(roadmap, indent=2))

        elif args.full_report or args.project_scan:
            reporter = ConsolidatedReporter(discovery.metrics, recommender)
            print(reporter.generate_consolidated_report())

            if args.json:
                plan = recommender.generate_optimization_plan()
                print("\n" + json.dumps(plan, indent=2))

    # LEGACY MODE (compare 2 branches)
    else:
        evaluator = MergeEvaluator()

        if args.dev1:
            agent_file = os.path.join(args.dev1, 'agent.md')
            mistake_file = os.path.join(args.dev1, 'mistake.md')
            evaluator.add_branch('branch-dev1', agent_file, mistake_file)

        if args.dev2:
            agent_file = os.path.join(args.dev2, 'agent.md')
            mistake_file = os.path.join(args.dev2, 'mistake.md')
            evaluator.add_branch('branch-dev2', agent_file, mistake_file)

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