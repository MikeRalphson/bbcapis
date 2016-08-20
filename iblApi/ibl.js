
/* Get the programme for a given programme identifier. */
function getProgrammes(pid){
  var p = '/ibl/v1/programmes/{pid}';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getProgrammesRights = 'rights';
const getProgrammesRightsMobile = 'rights=mobile';
const getProgrammesRightsTv = 'rights=tv';
const getProgrammesRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getProgrammesAvailability = 'availability';
const getProgrammesAvailabilityAll = 'availability=all';
const getProgrammesAvailabilityAvailable = 'availability=available';
/* The depth to return child entities. */
const getProgrammesInitialChildCount = 'initial_child_count';

/* Get the child episodes belonging to a given programme identifier. */
function getProgrammesEpisodes(pid){
  var p = '/ibl/v1/programmes/{pid}/episodes';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getProgrammesEpisodesRights = 'rights';
const getProgrammesEpisodesRightsMobile = 'rights=mobile';
const getProgrammesEpisodesRightsTv = 'rights=tv';
const getProgrammesEpisodesRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getProgrammesEpisodesAvailability = 'availability';
const getProgrammesEpisodesAvailabilityAll = 'availability=all';
const getProgrammesEpisodesAvailabilityAvailable = 'availability=available';
/* The depth to return child entities. */
const getProgrammesEpisodesInitialChildCount = 'initial_child_count';

/* Get the episode for a given episode identifier. */
function getEpisodes(pid){
  var p = '/ibl/v1/episodes/{pid}';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getEpisodesRights = 'rights';
const getEpisodesRightsMobile = 'rights=mobile';
const getEpisodesRightsTv = 'rights=tv';
const getEpisodesRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getEpisodesAvailability = 'availability';
const getEpisodesAvailabilityAll = 'availability=all';
const getEpisodesAvailabilityAvailable = 'availability=available';
/* Request additional data in the output */
const getEpisodesMixin = 'mixin';
const getEpisodesMixinLive = 'mixin=live';
const getEpisodesMixinPromotions = 'mixin=promotions';

/* Get the Programmes whose title begins with the given initial character. */
function getAtozProgrammes(letter){
  var p = '/ibl/v1/atoz/{letter}/programmes';
  p = p.replace('{letter}',letter);
  return p;
}
/* Letter to search by, a to z or the string '0-9' */
/* The rights group to limit results to. */
const getAtozProgrammesRights = 'rights';
const getAtozProgrammesRightsMobile = 'rights=mobile';
const getAtozProgrammesRightsTv = 'rights=tv';
const getAtozProgrammesRightsWeb = 'rights=web';
/* The page index. */
const getAtozProgrammesPage = 'page';
/* The number of results to return. */
const getAtozProgrammesPerPage = 'per_page';
/* The depth to return child entities. */
const getAtozProgrammesInitialChildCount = 'initial_child_count';
/* The sort order of the results. */
const getAtozProgrammesSort = 'sort';
const getAtozProgrammesSortTitle = 'sort=title';
/* Whether to sort ascending or descending */
const getAtozProgrammesSortDirection = 'sort_direction';
const getAtozProgrammesSortDirectionAsc = 'sort_direction=asc';
const getAtozProgrammesSortDirectionDesc = 'sort_direction=desc';
/* Whether to return all, or available programmes */
const getAtozProgrammesAvailability = 'availability';
const getAtozProgrammesAvailabilityAll = 'availability=all';
const getAtozProgrammesAvailabilityAvailable = 'availability=available';

/* Get Trailers (pre-rolls) */
function getEpisodesPrerolls(pid){
  var p = '/ibl/v1/episodes/{pid}/prerolls';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getEpisodesPrerollsRights = 'rights';
const getEpisodesPrerollsRightsMobile = 'rights=mobile';
const getEpisodesPrerollsRightsTv = 'rights=tv';
const getEpisodesPrerollsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getEpisodesPrerollsAvailability = 'availability';
const getEpisodesPrerollsAvailabilityAll = 'availability=all';
const getEpisodesPrerollsAvailabilityAvailable = 'availability=available';

/* Get Clips */
function getClips(pid){
  var p = '/ibl/v1/clips/{pid}';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getClipsRights = 'rights';
const getClipsRightsMobile = 'rights=mobile';
const getClipsRightsTv = 'rights=tv';
const getClipsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getClipsAvailability = 'availability';
const getClipsAvailabilityAll = 'availability=all';
const getClipsAvailabilityAvailable = 'availability=available';

/* Search-suggest */
const getSearchSuggest = '/ibl/v1/search-suggest';
/* The term to search for. */
const getSearchSuggestQ = 'q';
/* The language for any applicable localised strings. */
const getSearchSuggestLang = 'lang';
const getSearchSuggestLangEn = 'lang=en';
const getSearchSuggestLangCy = 'lang=cy';
const getSearchSuggestLangGa = 'lang=ga';
const getSearchSuggestLangGd = 'lang=gd';
const getSearchSuggestLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getSearchSuggestRights = 'rights';
const getSearchSuggestRightsMobile = 'rights=mobile';
const getSearchSuggestRightsTv = 'rights=tv';
const getSearchSuggestRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getSearchSuggestAvailability = 'availability';
const getSearchSuggestAvailabilityAll = 'availability=all';
const getSearchSuggestAvailabilityAvailable = 'availability=available';

/* Get schedule by channel */
function getChannelsSchedule(channel,date){
  var p = '/ibl/v1/channels/{channel}/schedule/{date}';
  p = p.replace('{channel}',channel);
  p = p.replace('{date}',date);
  return p;
}
/* The channel identifier to limit results to. */
/* The date to return the schedule for, yyyy-mm-dd format */
/* The language for any applicable localised strings. */
const getChannelsScheduleLang = 'lang';
const getChannelsScheduleLangEn = 'lang=en';
const getChannelsScheduleLangCy = 'lang=cy';
const getChannelsScheduleLangGa = 'lang=ga';
const getChannelsScheduleLangGd = 'lang=gd';
const getChannelsScheduleLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getChannelsScheduleRights = 'rights';
const getChannelsScheduleRightsMobile = 'rights=mobile';
const getChannelsScheduleRightsTv = 'rights=tv';
const getChannelsScheduleRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getChannelsScheduleAvailability = 'availability';
const getChannelsScheduleAvailabilityAll = 'availability=all';
const getChannelsScheduleAvailabilityAvailable = 'availability=available';

/* Get the editorial highlights of a given channel in TV & iPlayer. */
function getChannelsHighlights(channel){
  var p = '/ibl/v1/channels/{channel}/highlights';
  p = p.replace('{channel}',channel);
  return p;
}
/* The channel identifier to limit results to. */
/* The language for any applicable localised strings. */
const getChannelsHighlightsLang = 'lang';
const getChannelsHighlightsLangEn = 'lang=en';
const getChannelsHighlightsLangCy = 'lang=cy';
const getChannelsHighlightsLangGa = 'lang=ga';
const getChannelsHighlightsLangGd = 'lang=gd';
const getChannelsHighlightsLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getChannelsHighlightsRights = 'rights';
const getChannelsHighlightsRightsMobile = 'rights=mobile';
const getChannelsHighlightsRightsTv = 'rights=tv';
const getChannelsHighlightsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getChannelsHighlightsAvailability = 'availability';
const getChannelsHighlightsAvailabilityAll = 'availability=all';
const getChannelsHighlightsAvailabilityAvailable = 'availability=available';
/* Whether to include live programmes */
const getChannelsHighlightsLive = 'live';
/* Request additional data in the output */
const getChannelsHighlightsMixin = 'mixin';
const getChannelsHighlightsMixinLive = 'mixin=live';
const getChannelsHighlightsMixinPromotions = 'mixin=promotions';

/* Search */
const getSearch = '/ibl/v1/search';
/* The term to search for. */
const getSearchQ = 'q';
/* The language for any applicable localised strings. */
const getSearchLang = 'lang';
const getSearchLangEn = 'lang=en';
const getSearchLangCy = 'lang=cy';
const getSearchLangGa = 'lang=ga';
const getSearchLangGd = 'lang=gd';
const getSearchLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getSearchRights = 'rights';
const getSearchRightsMobile = 'rights=mobile';
const getSearchRightsTv = 'rights=tv';
const getSearchRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getSearchAvailability = 'availability';
const getSearchAvailabilityAll = 'availability=all';
const getSearchAvailabilityAvailable = 'availability=available';

/* Get the list of all the categories in TV & iPlayer. */
const getCategories = '/ibl/v1/categories';
/* The language for any applicable localised strings. */
const getCategoriesLang = 'lang';
const getCategoriesLangEn = 'lang=en';
const getCategoriesLangCy = 'lang=cy';
const getCategoriesLangGa = 'lang=ga';
const getCategoriesLangGd = 'lang=gd';
const getCategoriesLangPi = 'lang=pi';

/* Get sub-categories */
function getCategories2(category){
  var p = '/ibl/v1/categories/{category}';
  p = p.replace('{category}',category);
  return p;
}
/* The category identifier to return results from. */
/* The language for any applicable localised strings. */
const getCategories2Lang = 'lang';
const getCategories2LangEn = 'lang=en';
const getCategories2LangCy = 'lang=cy';
const getCategories2LangGa = 'lang=ga';
const getCategories2LangGd = 'lang=gd';
const getCategories2LangPi = 'lang=pi';

/* Get the list of all the Programmes (TLEOs) for a given category in TV & iPlayer. */
function getCategoriesProgrammes(category){
  var p = '/ibl/v1/categories/{category}/programmes';
  p = p.replace('{category}',category);
  return p;
}
/* The category identifier to return results from. */
/* The language for any applicable localised strings. */
const getCategoriesProgrammesLang = 'lang';
const getCategoriesProgrammesLangEn = 'lang=en';
const getCategoriesProgrammesLangCy = 'lang=cy';
const getCategoriesProgrammesLangGa = 'lang=ga';
const getCategoriesProgrammesLangGd = 'lang=gd';
const getCategoriesProgrammesLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getCategoriesProgrammesRights = 'rights';
const getCategoriesProgrammesRightsMobile = 'rights=mobile';
const getCategoriesProgrammesRightsTv = 'rights=tv';
const getCategoriesProgrammesRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getCategoriesProgrammesAvailability = 'availability';
const getCategoriesProgrammesAvailabilityAll = 'availability=all';
const getCategoriesProgrammesAvailabilityAvailable = 'availability=available';
/* The page index. */
const getCategoriesProgrammesPage = 'page';
/* The number of results to return. */
const getCategoriesProgrammesPerPage = 'per_page';

/* Get the list of all the episodes for a given category in TV & iPlayer. */
function getCategoriesEpisodes(category){
  var p = '/ibl/v1/categories/{category}/episodes';
  p = p.replace('{category}',category);
  return p;
}
/* The category identifier to return results from. */
/* The language for any applicable localised strings. */
const getCategoriesEpisodesLang = 'lang';
const getCategoriesEpisodesLangEn = 'lang=en';
const getCategoriesEpisodesLangCy = 'lang=cy';
const getCategoriesEpisodesLangGa = 'lang=ga';
const getCategoriesEpisodesLangGd = 'lang=gd';
const getCategoriesEpisodesLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getCategoriesEpisodesRights = 'rights';
const getCategoriesEpisodesRightsMobile = 'rights=mobile';
const getCategoriesEpisodesRightsTv = 'rights=tv';
const getCategoriesEpisodesRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getCategoriesEpisodesAvailability = 'availability';
const getCategoriesEpisodesAvailabilityAll = 'availability=all';
const getCategoriesEpisodesAvailabilityAvailable = 'availability=available';
/* The page index. */
const getCategoriesEpisodesPage = 'page';
/* The number of results to return. */
const getCategoriesEpisodesPerPage = 'per_page';
/* The sort order of the results. */
const getCategoriesEpisodesSort = 'sort';
const getCategoriesEpisodesSortRecent = 'sort=recent';
const getCategoriesEpisodesSortPopular = 'sort=popular';

/* Get programme recommendations */
function getEpisodesRecommendations(pid){
  var p = '/ibl/v1/episodes/{pid}/recommendations';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getEpisodesRecommendationsRights = 'rights';
const getEpisodesRecommendationsRightsMobile = 'rights=mobile';
const getEpisodesRecommendationsRightsTv = 'rights=tv';
const getEpisodesRecommendationsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getEpisodesRecommendationsAvailability = 'availability';
const getEpisodesRecommendationsAvailabilityAll = 'availability=all';
const getEpisodesRecommendationsAvailabilityAvailable = 'availability=available';
/* The page index. */
const getEpisodesRecommendationsPage = 'page';
/* The number of results to return. */
const getEpisodesRecommendationsPerPage = 'per_page';

/* Get the current iPlayer business layer status. This tells the caller the status of the iPlayer data, but not necessarily the overall status of the website. In the future it might include the status of the dependent data services within the BBC. */
const getStatus = '/ibl/v1/status';

/* Get the list of all the channels TV & iPlayer. */
const getChannels = '/ibl/v1/channels';
/* The region to get the channels for. */
const getChannelsRegion = 'region';
/* The language for any applicable localised strings. */
const getChannelsLang = 'lang';
const getChannelsLangEn = 'lang=en';
const getChannelsLangCy = 'lang=cy';
const getChannelsLangGa = 'lang=ga';
const getChannelsLangGd = 'lang=gd';
const getChannelsLangPi = 'lang=pi';

/* Get programmes popular */
const getGroupsPopularEpisodes = '/ibl/v1/groups/popular/episodes';
/* The rights group to limit results to. */
const getGroupsPopularEpisodesRights = 'rights';
const getGroupsPopularEpisodesRightsMobile = 'rights=mobile';
const getGroupsPopularEpisodesRightsTv = 'rights=tv';
const getGroupsPopularEpisodesRightsWeb = 'rights=web';
/* The page index. */
const getGroupsPopularEpisodesPage = 'page';
/* The number of results to return. */
const getGroupsPopularEpisodesPerPage = 'per_page';
/* The depth to return child entities. */
const getGroupsPopularEpisodesInitialChildCount = 'initial_child_count';
/* The sort order of the results. */
const getGroupsPopularEpisodesSort = 'sort';
/* Whether to sort ascending or descending */
const getGroupsPopularEpisodesSortDirection = 'sort_direction';
const getGroupsPopularEpisodesSortDirectionAsc = 'sort_direction=asc';
const getGroupsPopularEpisodesSortDirectionDesc = 'sort_direction=desc';
/* Whether to return all, or available programmes */
const getGroupsPopularEpisodesAvailability = 'availability';
const getGroupsPopularEpisodesAvailabilityAll = 'availability=all';
const getGroupsPopularEpisodesAvailabilityAvailable = 'availability=available';
/* Request additional data in the output */
const getGroupsPopularEpisodesMixin = 'mixin';
const getGroupsPopularEpisodesMixinLive = 'mixin=live';
const getGroupsPopularEpisodesMixinPromotions = 'mixin=promotions';

/* Get episodes by group, brand or series */
function getGroupsEpisodes(pid){
  var p = '/ibl/v1/groups/{pid}/episodes';
  p = p.replace('{pid}',pid);
  return p;
}
/* The programme identifier. */
/* The rights group to limit results to. */
const getGroupsEpisodesRights = 'rights';
const getGroupsEpisodesRightsMobile = 'rights=mobile';
const getGroupsEpisodesRightsTv = 'rights=tv';
const getGroupsEpisodesRightsWeb = 'rights=web';
/* The page index. */
const getGroupsEpisodesPage = 'page';
/* The number of results to return. */
const getGroupsEpisodesPerPage = 'per_page';
/* The depth to return child entities. */
const getGroupsEpisodesInitialChildCount = 'initial_child_count';
/* The sort order of the results. */
const getGroupsEpisodesSort = 'sort';
/* Whether to sort ascending or descending */
const getGroupsEpisodesSortDirection = 'sort_direction';
const getGroupsEpisodesSortDirectionAsc = 'sort_direction=asc';
const getGroupsEpisodesSortDirectionDesc = 'sort_direction=desc';
/* Whether to return all, or available programmes */
const getGroupsEpisodesAvailability = 'availability';
const getGroupsEpisodesAvailabilityAll = 'availability=all';
const getGroupsEpisodesAvailabilityAvailable = 'availability=available';
/* Request additional data in the output */
const getGroupsEpisodesMixin = 'mixin';
const getGroupsEpisodesMixinLive = 'mixin=live';
const getGroupsEpisodesMixinPromotions = 'mixin=promotions';

/* Get the editorial highlights of a given category in TV & iPlayer. */
function getCategoriesHighlights(category){
  var p = '/ibl/v1/categories/{category}/highlights';
  p = p.replace('{category}',category);
  return p;
}
/* The category identifier to return results from. */
/* The language for any applicable localised strings. */
const getCategoriesHighlightsLang = 'lang';
const getCategoriesHighlightsLangEn = 'lang=en';
const getCategoriesHighlightsLangCy = 'lang=cy';
const getCategoriesHighlightsLangGa = 'lang=ga';
const getCategoriesHighlightsLangGd = 'lang=gd';
const getCategoriesHighlightsLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getCategoriesHighlightsRights = 'rights';
const getCategoriesHighlightsRightsMobile = 'rights=mobile';
const getCategoriesHighlightsRightsTv = 'rights=tv';
const getCategoriesHighlightsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getCategoriesHighlightsAvailability = 'availability';
const getCategoriesHighlightsAvailabilityAll = 'availability=all';
const getCategoriesHighlightsAvailabilityAvailable = 'availability=available';
/* Request additional data in the output */
const getCategoriesHighlightsMixin = 'mixin';
const getCategoriesHighlightsMixinLive = 'mixin=live';
const getCategoriesHighlightsMixinPromotions = 'mixin=promotions';

/* Get programmes by channel */
function getChannelsProgrammes(channel){
  var p = '/ibl/v1/channels/{channel}/programmes';
  p = p.replace('{channel}',channel);
  return p;
}
/* The channel identifier to limit results to. */
/* The language for any applicable localised strings. */
const getChannelsProgrammesLang = 'lang';
const getChannelsProgrammesLangEn = 'lang=en';
const getChannelsProgrammesLangCy = 'lang=cy';
const getChannelsProgrammesLangGa = 'lang=ga';
const getChannelsProgrammesLangGd = 'lang=gd';
const getChannelsProgrammesLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getChannelsProgrammesRights = 'rights';
const getChannelsProgrammesRightsMobile = 'rights=mobile';
const getChannelsProgrammesRightsTv = 'rights=tv';
const getChannelsProgrammesRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getChannelsProgrammesAvailability = 'availability';
const getChannelsProgrammesAvailabilityAll = 'availability=all';
const getChannelsProgrammesAvailabilityAvailable = 'availability=available';
/* The page index. */
const getChannelsProgrammesPage = 'page';
/* The number of results to return. */
const getChannelsProgrammesPerPage = 'per_page';

/* Get the list of all the regions TV & iPlayer. */
const getRegions = '/ibl/v1/regions';
/* The language for any applicable localised strings. */
const getRegionsLang = 'lang';
const getRegionsLangEn = 'lang=en';
const getRegionsLangCy = 'lang=cy';
const getRegionsLangGa = 'lang=ga';
const getRegionsLangGd = 'lang=gd';
const getRegionsLangPi = 'lang=pi';

/* Get user watching */
const getUserWatching = '/ibl/v1/user/watching';
/* The BBC-id cookie value */
const getUserWatchingIdentityCookie = 'identity_cookie';

/* Get schema */
const getSchemaIbl = '/ibl/v1/schema/ibl.json';

/* Get broadcasts by channel */
function getChannelsBroadcasts(channel){
  var p = '/ibl/v1/channels/{channel}/broadcasts';
  p = p.replace('{channel}',channel);
  return p;
}
/* The channel identifier to limit results to. */
/* The language for any applicable localised strings. */
const getChannelsBroadcastsLang = 'lang';
const getChannelsBroadcastsLangEn = 'lang=en';
const getChannelsBroadcastsLangCy = 'lang=cy';
const getChannelsBroadcastsLangGa = 'lang=ga';
const getChannelsBroadcastsLangGd = 'lang=gd';
const getChannelsBroadcastsLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getChannelsBroadcastsRights = 'rights';
const getChannelsBroadcastsRightsMobile = 'rights=mobile';
const getChannelsBroadcastsRightsTv = 'rights=tv';
const getChannelsBroadcastsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getChannelsBroadcastsAvailability = 'availability';
const getChannelsBroadcastsAvailabilityAll = 'availability=all';
const getChannelsBroadcastsAvailabilityAvailable = 'availability=available';

/* Get user store purchases */
const getUserPurchases = '/ibl/v1/user/purchases';
/* The BBC-id cookie value */
const getUserPurchasesIdentityCookie = 'identity_cookie';

/* Get user store recommendations */
const getUserRecommendations = '/ibl/v1/user/recommendations';
/* The BBC-id cookie value */
const getUserRecommendationsIdentityCookie = 'identity_cookie';

/* Get programme highlights */
const getHomeHighlights = '/ibl/v1/home/highlights';
/* The language for any applicable localised strings. */
const getHomeHighlightsLang = 'lang';
const getHomeHighlightsLangEn = 'lang=en';
const getHomeHighlightsLangCy = 'lang=cy';
const getHomeHighlightsLangGa = 'lang=ga';
const getHomeHighlightsLangGd = 'lang=gd';
const getHomeHighlightsLangPi = 'lang=pi';
/* The rights group to limit results to. */
const getHomeHighlightsRights = 'rights';
const getHomeHighlightsRightsMobile = 'rights=mobile';
const getHomeHighlightsRightsTv = 'rights=tv';
const getHomeHighlightsRightsWeb = 'rights=web';
/* Whether to return all, or available programmes */
const getHomeHighlightsAvailability = 'availability';
const getHomeHighlightsAvailabilityAll = 'availability=all';
const getHomeHighlightsAvailabilityAvailable = 'availability=available';
/* Request additional data in the output */
const getHomeHighlightsMixin = 'mixin';
const getHomeHighlightsMixinLive = 'mixin=live';
const getHomeHighlightsMixinPromotions = 'mixin=promotions';

module.exports = {
  getProgrammes : getProgrammes,
  getProgrammesEpisodes : getProgrammesEpisodes,
  getEpisodes : getEpisodes,
  getAtozProgrammes : getAtozProgrammes,
  getEpisodesPrerolls : getEpisodesPrerolls,
  getClips : getClips,
  getSearchSuggest : getSearchSuggest,
  getChannelsSchedule : getChannelsSchedule,
  getChannelsHighlights : getChannelsHighlights,
  getSearch : getSearch,
  getCategories : getCategories,
  getCategories2 : getCategories2,
  getCategoriesProgrammes : getCategoriesProgrammes,
  getCategoriesEpisodes : getCategoriesEpisodes,
  getEpisodesRecommendations : getEpisodesRecommendations,
  getStatus : getStatus,
  getChannels : getChannels,
  getGroupsPopularEpisodes : getGroupsPopularEpisodes,
  getGroupsEpisodes : getGroupsEpisodes,
  getCategoriesHighlights : getCategoriesHighlights,
  getChannelsProgrammes : getChannelsProgrammes,
  getRegions : getRegions,
  getUserWatching : getUserWatching,
  getSchemaIbl : getSchemaIbl,
  getChannelsBroadcasts : getChannelsBroadcasts,
  getUserPurchases : getUserPurchases,
  getUserRecommendations : getUserRecommendations,
  getHomeHighlights : getHomeHighlights,
  host : 'ibl.api.bbci.co.uk'
};
