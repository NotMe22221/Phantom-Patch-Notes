/**
 * Commit Parser Module
 * Extracts and structures git commit data from repositories
 */

import simpleGit, { SimpleGit, LogResult } from 'simple-git';
import { CommitData, ParseOptions, SystemError } from '../../shared/types.js';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { ErrorHandler } from './error-handler.js';

/**
 * CommitParser class for extracting git commit data
 */
export class CommitParser {
  /**
   * Validates that a given path is a valid git repository
   * @param repoPath - Path to the repository
   * @returns Promise resolving to true if valid, false otherwise
   */
  async validateRepository(repoPath: string): Promise<boolean> {
    try {
      // Check if path exists
      if (!existsSync(repoPath)) {
        return false;
      }

      const git: SimpleGit = simpleGit(repoPath);
      
      // Check if it's a git repository
      const isRepo = await git.checkIsRepo();
      return isRepo;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets a descriptive error message for invalid repository paths
   * @param repoPath - The invalid repository path
   * @returns Descriptive error message
   */
  private getInvalidRepoMessage(repoPath: string): string {
    if (!existsSync(repoPath)) {
      return `Repository path does not exist: ${repoPath}. Please provide a valid directory path.`;
    }
    return `Path is not a valid git repository: ${repoPath}. Ensure the directory contains a .git folder.`;
  }

  /**
   * Parses a git repository and extracts commit data
   * @param options - Parse options including repo path and filters
   * @returns Promise resolving to array of structured commit data
   * @throws SystemError if repository is invalid or parsing fails
   */
  async parseRepository(options: ParseOptions): Promise<CommitData[]> {
    const { repoPath, dateRange, tags, maxCount } = options;

    try {
      // Validate repository path
      const isValid = await this.validateRepository(repoPath);
      if (!isValid) {
        throw ErrorHandler.createError(
          'INVALID_REPOSITORY',
          this.getInvalidRepoMessage(repoPath),
          'CommitParser',
          { repoPath }
        );
      }
    } catch (error) {
      // If validation itself fails, wrap the error
      if (ErrorHandler.isSystemError(error)) {
        throw error;
      }
      throw ErrorHandler.handle(error, 'CommitParser', { repoPath, operation: 'validateRepository' });
    }

    try {
      const git: SimpleGit = simpleGit(repoPath);
      
      // Build log options
      const logOptions: any = {};
      
      if (maxCount) {
        logOptions.maxCount = maxCount;
      }

      // Add date range filtering using git log options
      if (dateRange) {
        logOptions.after = dateRange.from.toISOString();
        logOptions.before = dateRange.to.toISOString();
      }

      // Get commits
      let commits: CommitData[];
      
      if (tags && tags.length > 0) {
        // If tags are specified, get commits for those tags
        const allCommits: CommitData[] = [];
        
        for (const tag of tags) {
          try {
            const tagLog = await git.log({ ...logOptions, from: tag });
            const tagCommits = this.transformCommits(tagLog);
            allCommits.push(...tagCommits);
          } catch (error) {
            // Tag might not exist, continue with other tags
            console.warn(`Warning: Could not fetch commits for tag ${tag}`);
          }
        }
        
        // Remove duplicates based on hash
        commits = this.deduplicateCommits(allCommits);
      } else {
        // Get all commits with filters
        const logResult = await git.log(logOptions);
        commits = this.transformCommits(logResult);
      }

      // Apply post-filtering for date range to ensure accuracy
      if (dateRange) {
        commits = this.filterByDateRange(commits, dateRange.from, dateRange.to);
      }

      // Apply maxCount if specified (in case post-filtering changed the count)
      if (maxCount && commits.length > maxCount) {
        commits = commits.slice(0, maxCount);
      }

      return commits;
    } catch (error) {
      // If it's already a SystemError, re-throw it
      if (ErrorHandler.isSystemError(error)) {
        throw error;
      }

      // Provide specific git error information
      const gitErrorDetails = ErrorHandler.extractGitErrorDetails(error);
      
      throw ErrorHandler.handle(
        error,
        'CommitParser',
        { 
          repoPath, 
          gitError: gitErrorDetails,
          filters: { dateRange, tags, maxCount },
          operation: 'parseRepository'
        }
      );
    }
  }

  /**
   * Transforms simple-git log result into CommitData array
   * @param logResult - Result from simple-git log operation
   * @returns Array of structured commit data
   */
  private transformCommits(logResult: LogResult): CommitData[] {
    return logResult.all.map(commit => ({
      hash: commit.hash,
      author: commit.author_name,
      email: commit.author_email,
      timestamp: new Date(commit.date),
      message: commit.message,
      changedFiles: commit.diff?.files?.map(f => f.file) || []
    }));
  }

  /**
   * Removes duplicate commits based on hash
   * @param commits - Array of commits that may contain duplicates
   * @returns Array of unique commits
   */
  private deduplicateCommits(commits: CommitData[]): CommitData[] {
    const seen = new Set<string>();
    return commits.filter(commit => {
      if (seen.has(commit.hash)) {
        return false;
      }
      seen.add(commit.hash);
      return true;
    });
  }

  /**
   * Filters commits by date range
   * @param commits - Array of commits to filter
   * @param from - Start date (inclusive)
   * @param to - End date (inclusive)
   * @returns Filtered array of commits
   */
  private filterByDateRange(commits: CommitData[], from: Date, to: Date): CommitData[] {
    return commits.filter(commit => {
      const commitTime = commit.timestamp.getTime();
      return commitTime >= from.getTime() && commitTime <= to.getTime();
    });
  }

}
