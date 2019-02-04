import debug from 'debug';
import { BaseMemoryStore, Store } from 'express-session';

const d = debug('memory-store');

export class MemoryStore extends Store implements BaseMemoryStore {
  /**
   * A key/value mapping of session IDs to serialized (stringified) sessions.
   */
  private readonly sessions: Map<string, string>;

  public constructor() {
    super();
    this.sessions = new Map();
  }

  /**
   * Get all active sessions.
   */
  public all: Store['all'] = (callback) => {
    // NOTE: The docs indicate that this should be an array of sessions; however, the signature in
    // the TypeScript definition indicates this should be an object.
    const sessions: {
      // noinspection TypeScriptUnresolvedVariable
      [sid: string]: Express.SessionData
    } = {};

    try {
      this.sessions.forEach((value, key) => {
        sessions[key] = JSON.parse(value);
      });

      d('all:sessions %O', sessions);
      callback && setImmediate(callback, null, sessions);
    } catch (err) {
      d('all:error', err);
      callback && setImmediate(callback, err)
    }
  };

  /**
   * Destroy the session associated with the given session ID.
   */
  public destroy: Store['destroy'] = (id, callback) => {
    d('destroy:id %s', id);
    this.sessions.delete(id);
    callback && setImmediate(callback, null);
  };

  /**
   * Clear all sessions.
   */
  public clear: Store['clear'] = (callback) => {
    d('clear');
    this.sessions.clear();
    callback && setImmediate(callback, null);
  };

  /**
   * Get number of active sessions.
   */
  public length: Store['length'] = (callback) => {
    const { size } = this.sessions;
    d('length %d', size);
    callback && setImmediate(callback, null, size);
  };

  /**
   * Fetch session by the given session ID.
   */
  public get: Store['get'] = (id, callback) => {
    try {
      const session = this.sessions.has(id)
        ? JSON.parse(this.sessions.get(id) as string)
        : undefined;

      if (typeof session !== 'undefined' && typeof session.cookie === 'object') {
        const expires = typeof session.cookie.expires === 'string'
          ? new Date(session.cookie.expires)
          : session.cookie.expires;

        // Destroy expired session
        // NOTE: if expires === true, then expires <= new Date() === true
        if (expires && expires <= new Date()) {
          d('get:expires:id %s', id);
          this.sessions.delete(id);
          callback && setImmediate(callback, null, undefined);
          return;
        }
      }

      d('get:id %s', id);
      callback && setImmediate(callback, null, session);
    } catch (err) {
      d('get:error', err);
      callback && setImmediate(callback, err);
    }
  };

  /**
   * Commit the given session associated with the given sessionId to the store.
   */
  public set: Store['set'] = (id, session, callback) => {
    try {
      d('set:id %s', id);
      d('set:session %O', session);
      this.sessions.set(id, JSON.stringify(session));
      callback && setImmediate(callback, null);
    } catch (err) {
      d('set:error', err);
      callback && setImmediate(callback, err);
    }
  };

  /**
   * Touch the given session object associated with the given session ID.
   */
  public touch: Store['touch'] = (id, session, callback) => {
    if (this.sessions.has(id)) {
      try {
        // noinspection TypeScriptUnresolvedVariable
        const oldSession: Express.SessionData = JSON.parse(this.sessions.get(id) as string);
        // noinspection TypeScriptUnresolvedVariable
        const newSession: Express.SessionData = { ...oldSession, ...session };

        this.sessions.set(id, JSON.stringify(newSession));

        d('touch:expires %s', newSession.cookie.expires);
      } catch (err) {
        d('touch:error', err);
        callback && setImmediate(callback, err);
        return;
      }
    }

    callback && setImmediate(callback, null);
  };
}
