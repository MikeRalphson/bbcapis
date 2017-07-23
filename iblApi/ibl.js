/**
@author openapi2js http://github.com/mermade/openapi2js
@copyright Copyright (c) 2017 Mike Ralphson
@license https://opensource.org/licenses/BSD-3-Clause
*/
/** The rights group to limit results to. */
const commonRights = 'rights';
const commonRightsMobile = 'rights=mobile';
const commonRightsTv = 'rights=tv';
const commonRightsWeb = 'rights=web';
/** Whether to return all, or available programmes */
const commonAvailability = 'availability';
const commonAvailabilityAll = 'availability=all';
const commonAvailabilityAvailable = 'availability=available';
/** The depth to return child entities. */
const commonInitialChildCount = 'initial_child_count';
/** Request additional data in the output */
const commonMixin = 'mixin';
const commonMixinLive = 'mixin=live';
const commonMixinPromotions = 'mixin=promotions';
/** The page index. */
const commonPage = 'page';
/** The number of results to return. */
const commonPerPage = 'per_page';
/** Whether to sort ascending or descending */
const commonSortDirection = 'sort_direction';
const commonSortDirectionAsc = 'sort_direction=asc';
const commonSortDirectionDesc = 'sort_direction=desc';
/** The term to search for. */
const commonQ = 'q';
/** The language for any applicable localised strings. */
const commonLang = 'lang';
const commonLangEn = 'lang=en';
const commonLangCy = 'lang=cy';
const commonLangGa = 'lang=ga';
const commonLangGd = 'lang=gd';
const commonLangPi = 'lang=pi';
/** The sort order of the results. */
const commonSort = 'sort';
/** The BBC-id cookie value */
const commonIdentityCookie = 'identity_cookie';

/** Get the programme for a given programme identifier.
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getProgrammes(pid){
  var p = '/ibl/v1/programmes/{pid}';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get the child episodes belonging to a given programme identifier.
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getProgrammesEpisodes(pid){
  var p = '/ibl/v1/programmes/{pid}/episodes';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get the episode for a given episode identifier.
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getEpisodes(pid){
  var p = '/ibl/v1/episodes/{pid}';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get the Programmes whose title begins with the given initial character.
@param {string} letter Letter to search by, a to z or the string '0-9'
@return {string} The path to request
*/
function getAtozProgrammes(letter){
  var p = '/ibl/v1/atoz/{letter}/programmes';
  p = p.replace('{letter}',letter);
  return p;
}
/** The sort order of the results. */
const getAtozProgrammesSort = 'sort';
const getAtozProgrammesSortTitle = 'sort=title';

/** Get Trailers (pre-rolls)
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getEpisodesPrerolls(pid){
  var p = '/ibl/v1/episodes/{pid}/prerolls';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get Follow-ups (post-rolls)
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getEpisodesPostrolls(pid){
  var p = '/ibl/v1/episodes/{pid}/postrolls';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get Onward Journey (next programme)
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getEpisodesNext(pid){
  var p = '/ibl/v1/episodes/{pid}/next';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get Clips
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getClips(pid){
  var p = '/ibl/v1/clips/{pid}';
  p = p.replace('{pid}',pid);
  return p;
}

/** Search-suggest*/
const getSearchSuggest = '/ibl/v1/search-suggest';

/** Get schedule by channel
@param {string} channel The channel identifier to limit results to.
@param {string} date The date to return the schedule for, yyyy-mm-dd format
@return {string} The path to request
*/
function getChannelsSchedule(channel,date){
  var p = '/ibl/v1/channels/{channel}/schedule/{date}';
  p = p.replace('{channel}',channel);
  p = p.replace('{date}',date);
  return p;
}

/** Get the editorial highlights of a given channel in TV & iPlayer.
@param {string} channel The channel identifier to limit results to.
@return {string} The path to request
*/
function getChannelsHighlights(channel){
  var p = '/ibl/v1/channels/{channel}/highlights';
  p = p.replace('{channel}',channel);
  return p;
}
/** Whether to include live programmes */
const getChannelsHighlightsLive = 'live';

/** Search*/
const getSearch = '/ibl/v1/search';

/** Get the list of all the categories in TV & iPlayer.*/
const getCategories = '/ibl/v1/categories';

/** Get sub-categories
@param {string} category The category identifier to return results from.
@return {string} The path to request
*/
function getCategories2(category){
  var p = '/ibl/v1/categories/{category}';
  p = p.replace('{category}',category);
  return p;
}

/** Get the list of all the Programmes (TLEOs) for a given category in TV & iPlayer.
@param {string} category The category identifier to return results from.
@return {string} The path to request
*/
function getCategoriesProgrammes(category){
  var p = '/ibl/v1/categories/{category}/programmes';
  p = p.replace('{category}',category);
  return p;
}

/** Get the list of all the episodes for a given category in TV & iPlayer.
@param {string} category The category identifier to return results from.
@return {string} The path to request
*/
function getCategoriesEpisodes(category){
  var p = '/ibl/v1/categories/{category}/episodes';
  p = p.replace('{category}',category);
  return p;
}
/** The sort order of the results. */
const getCategoriesEpisodesSort = 'sort';
const getCategoriesEpisodesSortRecent = 'sort=recent';
const getCategoriesEpisodesSortPopular = 'sort=popular';

/** Get programme recommendations
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getEpisodesRecommendations(pid){
  var p = '/ibl/v1/episodes/{pid}/recommendations';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get the current iPlayer business layer status. This tells the caller the status of the iPlayer data, but not necessarily the overall status of the website. In the future it might include the status of the dependent data services within the BBC.*/
const getStatus = '/ibl/v1/status';

/** Get the list of all the channels TV & iPlayer.*/
const getChannels = '/ibl/v1/channels';
/** The region to get the channels for. */
const getChannelsRegion = 'region';

/** Get programmes popular*/
const getGroupsPopularEpisodes = '/ibl/v1/groups/popular/episodes';

/** Get episodes by group, brand or series
@param {string} pid The programme identifier.
@return {string} The path to request
*/
function getGroupsEpisodes(pid){
  var p = '/ibl/v1/groups/{pid}/episodes';
  p = p.replace('{pid}',pid);
  return p;
}

/** Get the editorial highlights of a given category in TV & iPlayer.
@param {string} category The category identifier to return results from.
@return {string} The path to request
*/
function getCategoriesHighlights(category){
  var p = '/ibl/v1/categories/{category}/highlights';
  p = p.replace('{category}',category);
  return p;
}

/** Get programmes by channel
@param {string} channel The channel identifier to limit results to.
@return {string} The path to request
*/
function getChannelsProgrammes(channel){
  var p = '/ibl/v1/channels/{channel}/programmes';
  p = p.replace('{channel}',channel);
  return p;
}

/** Get the list of all the regions TV & iPlayer.*/
const getRegions = '/ibl/v1/regions';

/** Get user watching*/
const getUserWatching = '/ibl/v1/user/watching';

/** Get schema*/
const getSchemaIbl = '/ibl/v1/schema/ibl.json';

/** Get broadcasts by channel
@param {string} channel The channel identifier to limit results to.
@return {string} The path to request
*/
function getChannelsBroadcasts(channel){
  var p = '/ibl/v1/channels/{channel}/broadcasts';
  p = p.replace('{channel}',channel);
  return p;
}
/** Time to return results from, e.g. -3h */
const getChannelsBroadcastsFrom = 'from';

/** Get user store purchases*/
const getUserPurchases = '/ibl/v1/user/purchases';

/** Get user store recommendations*/
const getUserRecommendations = '/ibl/v1/user/recommendations';

/** Get programme highlights*/
const getHomeHighlights = '/ibl/v1/home/highlights';

module.exports = {
  commonRights : commonRights,
  commonRightsMobile : commonRightsMobile,
  commonRightsTv : commonRightsTv,
  commonRightsWeb : commonRightsWeb,
  commonAvailability : commonAvailability,
  commonAvailabilityAll : commonAvailabilityAll,
  commonAvailabilityAvailable : commonAvailabilityAvailable,
  commonInitialChildCount : commonInitialChildCount,
  commonMixin : commonMixin,
  commonMixinLive : commonMixinLive,
  commonMixinPromotions : commonMixinPromotions,
  commonPage : commonPage,
  commonPerPage : commonPerPage,
  commonSortDirection : commonSortDirection,
  commonSortDirectionAsc : commonSortDirectionAsc,
  commonSortDirectionDesc : commonSortDirectionDesc,
  commonQ : commonQ,
  commonLang : commonLang,
  commonLangEn : commonLangEn,
  commonLangCy : commonLangCy,
  commonLangGa : commonLangGa,
  commonLangGd : commonLangGd,
  commonLangPi : commonLangPi,
  commonSort : commonSort,
  commonIdentityCookie : commonIdentityCookie,
  getProgrammes : getProgrammes,
  getProgrammesEpisodes : getProgrammesEpisodes,
  getEpisodes : getEpisodes,
  getAtozProgrammes : getAtozProgrammes,
  getAtozProgrammesSort : getAtozProgrammesSort,
  getAtozProgrammesSortTitle : getAtozProgrammesSortTitle,
  getEpisodesPrerolls : getEpisodesPrerolls,
  getEpisodesPostrolls : getEpisodesPostrolls,
  getEpisodesNext : getEpisodesNext,
  getClips : getClips,
  getSearchSuggest : getSearchSuggest,
  getChannelsSchedule : getChannelsSchedule,
  getChannelsHighlights : getChannelsHighlights,
  getChannelsHighlightsLive : getChannelsHighlightsLive,
  getSearch : getSearch,
  getCategories : getCategories,
  getCategories2 : getCategories2,
  getCategoriesProgrammes : getCategoriesProgrammes,
  getCategoriesEpisodes : getCategoriesEpisodes,
  getCategoriesEpisodesSort : getCategoriesEpisodesSort,
  getCategoriesEpisodesSortRecent : getCategoriesEpisodesSortRecent,
  getCategoriesEpisodesSortPopular : getCategoriesEpisodesSortPopular,
  getEpisodesRecommendations : getEpisodesRecommendations,
  getStatus : getStatus,
  getChannels : getChannels,
  getChannelsRegion : getChannelsRegion,
  getGroupsPopularEpisodes : getGroupsPopularEpisodes,
  getGroupsEpisodes : getGroupsEpisodes,
  getCategoriesHighlights : getCategoriesHighlights,
  getChannelsProgrammes : getChannelsProgrammes,
  getRegions : getRegions,
  getUserWatching : getUserWatching,
  getSchemaIbl : getSchemaIbl,
  getChannelsBroadcasts : getChannelsBroadcasts,
  getChannelsBroadcastsFrom : getChannelsBroadcastsFrom,
  getUserPurchases : getUserPurchases,
  getUserRecommendations : getUserRecommendations,
  getHomeHighlights : getHomeHighlights,
  host : 'ibl.api.bbci.co.uk'
};
