import {Request} from 'express';
import {lookup as ipLookup} from 'geoip-lite';
import isbot from 'isbot';
import {parse as urlParse} from 'url';
import {
  Agent as UserAgent,
  parse as parseUserAgent,
} from 'useragent';

import {Link} from './models/links';
import {visit} from './models/visits';
import {castArray} from './utils/castArray';

export interface VisitRecord {
  headers: Record<string, string | string[]>;
  realIP: string;
  referrer: string;
  link: string; // @FIXME: This is reference
}

const BROWSERS_LIST = ['IE', 'Firefox', 'Chrome', 'Opera', 'Safari', 'Edge'] as const;
const BROWSERS_LIST_LOWERCASE = BROWSERS_LIST.map((browserName) => browserName.toLocaleLowerCase());
const OS_LIST = ['Windows', 'Mac OS', 'Linux', 'Android', 'iOS'] as const;
const OS_LIST_LOWERCASE = OS_LIST.map((osName) => osName.toLocaleLowerCase());

export type Browser = typeof BROWSERS_LIST[number] | 'Other';
export type OperatingSystem = typeof OS_LIST[number] | 'Other';

/**
 * Get unified browser name from `UserAgent`
 */
function filterInBrowser(agent: UserAgent): Browser {
  const agentFamily = agent.family.toLowerCase();
  const index = BROWSERS_LIST_LOWERCASE.findIndex((browser, index) => agentFamily.includes(browser));
  return index === -1 ? 'Other' : BROWSERS_LIST[index];
}

/**
 * Get unified OS name from `UserAgent`
 */
function filterInOs(agent: UserAgent): OperatingSystem {
  const osFamily = agent.os.family.toLowerCase();
  const index = OS_LIST_LOWERCASE.findIndex((os, index) => osFamily.includes(os));
  return index === -1 ? 'Other' : OS_LIST[index];
}

function getIpAddress(req: Request): string | null {
  return castArray(req.headers['x-real-ip'])[0] || req.connection.remoteAddress || null;
}

export async function visitLink(link: Link, req: Request) {
  const isBot = req.headers['user-agent']
    ? isbot(req.headers['user-agent'])
    : true;
  if (isBot) {
    return;
  }

  const reqReferrer = req.get('Referrer');
  const ip = getIpAddress(req);
  const agent = parseUserAgent(req.headers['user-agent']);

  const browser = filterInBrowser(agent)
  const os = filterInOs(agent);
  const referrer = (reqReferrer && urlParse(reqReferrer).hostname?.replace(/\./gi, '[dot]')) || 'direct';
  const location = ip && ipLookup(ip);
  const country = location && location.country;

  const newVisit = new visit({
    browser,
    country,
    ip,
    link,
    location,
    os,
    referrer,
    headers: req.headers,
  });
  await newVisit.save();
}
