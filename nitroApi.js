module.exports = {
sProgrammesGroupPositionAscending : function sProgrammesGroupPositionAscending(qs){
  // sort numerically by position in group, ascending
  // /nitro/api/programmes?sort=group_position&sort_direction=ascending
  qs=qs+'&sort=group_position&sort-direction=ascending';
  return qs;
},
sProgrammesPidAscending : function sProgrammesPidAscending(qs){
  // sort alphabetically by PID, descending
  // /nitro/api/programmes?sort=pid&sort_direction=ascending
  qs=qs+'&sort=pid&sort-direction=ascending';
  return qs;
},
sProgrammesPidDescending : function sProgrammesPidDescending(qs){
  // sort alphabetically by PID, descending
  // /nitro/api/programmes?sort=pid&sort_direction=descending
  qs=qs+'&sort=pid&sort-direction=descending';
  return qs;
},
sProgrammesPositionAscending : function sProgrammesPositionAscending(qs){
  // sort numerically by position, ascending
  // /nitro/api/programmes?sort=position&sort_direction=ascending
  qs=qs+'&sort=position&sort-direction=ascending';
  return qs;
},
sProgrammesPositionDescending : function sProgrammesPositionDescending(qs){
  // sort numerically by position, ascending
  // /nitro/api/programmes?sort=position&sort_direction=descending
  qs=qs+'&sort=position&sort-direction=descending';
  return qs;
},
sProgrammesPromotion : function sProgrammesPromotion(qs){
  // sort by promotion rank, ascending
  // note that this sort has no sort-direction
  qs=qs+'&sort=promotion';
  return qs;
},
sProgrammesReleaseDateAscending : function sProgrammesReleaseDateAscending(qs){
  // sort chronologically by release date, descending
  // /nitro/api/programmes?sort=release_date&sort_direction=ascending
  qs=qs+'&sort=release_date&sort-direction=ascending';
  return qs;
},
sProgrammesReleaseDateDescending : function sProgrammesReleaseDateDescending(qs){
  // sort chronologically by release date, descending
  // /nitro/api/programmes?sort=release_date&sort_direction=descending
  qs=qs+'&sort=release_date&sort-direction=descending';
  return qs;
},
sProgrammesRelevance : function sProgrammesRelevance(qs){
  // sort by weighting of search term (use with q parameter)
  // note that this sort has no sort-direction
  qs=qs+'&sort=relevance';
  return qs;
},
sProgrammesScheduledStartAscending : function sProgrammesScheduledStartAscending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/programmes?sort=scheduled_start&sort_direction=ascending
  qs=qs+'&sort=scheduled_start&sort-direction=ascending';
  return qs;
},
sProgrammesScheduledStartDescending : function sProgrammesScheduledStartDescending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/programmes?sort=scheduled_start&sort_direction=descending
  qs=qs+'&sort=scheduled_start&sort-direction=descending';
  return qs;
},
sProgrammesStrictTitleAscending : function sProgrammesStrictTitleAscending(qs){
  // sort alphabetically by title, ascending
  // /nitro/api/programmes?sort=strict_title&sort_direction=ascending
  qs=qs+'&sort=strict_title&sort-direction=ascending';
  return qs;
},
sProgrammesStrictTitleDescending : function sProgrammesStrictTitleDescending(qs){
  // sort alphabetically by title, ascending
  // /nitro/api/programmes?sort=strict_title&sort_direction=descending
  qs=qs+'&sort=strict_title&sort-direction=descending';
  return qs;
},
sProgrammesTitleAscending : function sProgrammesTitleAscending(qs){
  // sort by title librarian style (ignoring leading 'The', 'A', etc), ascending
  // /nitro/api/programmes?sort=title&sort_direction=ascending
  qs=qs+'&sort=title&sort-direction=ascending';
  return qs;
},
sProgrammesTitleDescending : function sProgrammesTitleDescending(qs){
  // sort by title librarian style (ignoring leading 'The', 'A', etc), ascending
  // /nitro/api/programmes?sort=title&sort_direction=descending
  qs=qs+'&sort=title&sort-direction=descending';
  return qs;
},
sProgrammesTreeAscending : function sProgrammesTreeAscending(qs){
  // sort by root pid and then preorder tree sort. Requires entities to have release date.
  // /nitro/api/programmes?sort=tree&sort_direction=ascending
  qs=qs+'&sort=tree&sort-direction=ascending';
  return qs;
},
sProgrammesTreeDescending : function sProgrammesTreeDescending(qs){
  // sort by root pid and then preorder tree sort. Requires entities to have release date.
  // /nitro/api/programmes?sort=tree&sort_direction=descending
  qs=qs+'&sort=tree&sort-direction=descending';
  return qs;
},
sProgrammesViewsAscending : function sProgrammesViewsAscending(qs){
  // sort numerically by number of views (most popular first - faster most_popular)
  // /nitro/api/programmes?sort=views&sort_direction=ascending
  qs=qs+'&sort=views&sort-direction=ascending';
  return qs;
},
sProgrammesViewsDescending : function sProgrammesViewsDescending(qs){
  // sort numerically by number of views (most popular first - faster most_popular)
  // /nitro/api/programmes?sort=views&sort_direction=descending
  qs=qs+'&sort=views&sort-direction=descending';
  return qs;
},
mProgrammesAlternateImages : function mProgrammesAlternateImages(qs){
  // mixin to return the alternate images for a programme
  qs=qs+'&mixin=alternate_images';
  return qs;
},
mProgrammesAncestorTitles : function mProgrammesAncestorTitles(qs){
  // mixin to return ancestor programme titles
  // /nitro/api/programmes?mixin=ancestor_titles
  qs=qs+'&mixin=ancestor_titles';
  return qs;
},
mProgrammesAvailability : function mProgrammesAvailability(qs){
  // mixin to return programme availability information
  qs=qs+'&mixin=availability';
  return qs;
},
mProgrammesContributions : function mProgrammesContributions(qs){
  // mixin to return information about contributors to a programme
  // /nitro/api/programmes?mixin=contributions
  qs=qs+'&mixin=contributions';
  return qs;
},
mProgrammesDuration : function mProgrammesDuration(qs){
  // mixin to return original version duration in programme concept entities
  // /nitro/api/programmes?mixin=duration
  qs=qs+'&mixin=duration';
  return qs;
},
mProgrammesGenreGroupings : function mProgrammesGenreGroupings(qs){
  // mixin to return list of genre groupings
  // /nitro/api/programmes?mixin=genre_groupings
  qs=qs+'&mixin=genre_groupings';
  return qs;
},
mProgrammesImages : function mProgrammesImages(qs){
  // mixin to add image information for a programme
  // /nitro/api/programmes?mixin=images
  qs=qs+'&mixin=images';
  return qs;
},
mProgrammesIsEmbeddable : function mProgrammesIsEmbeddable(qs){
  // mixin to add embeddable information for a programme
  // /nitro/api/programmes?mixin=is_embeddable
  qs=qs+'&mixin=is_embeddable';
  return qs;
},
mProgrammesPreviousNext : function mProgrammesPreviousNext(qs){
  // mixin to return the programmes which appear before and after a programme (as determined by the sort applied in the request)
  qs=qs+'&mixin=previous_next';
  return qs;
},
mProgrammesRelatedLinks : function mProgrammesRelatedLinks(qs){
  // mixin to return information about related links to a programme
  // /nitro/api/programmes?mixin=related_links
  qs=qs+'&mixin=related_links';
  return qs;
},
mProgrammesVersionsAvailability : function mProgrammesVersionsAvailability(qs){
  // mixin to return information about programmes that are currently available
  // /nitro/api/programmes?mixin=versions_availability
  qs=qs+'&mixin=versions_availability';
  return qs;
},
fProgrammesAudioDescribed : function fProgrammesAudioDescribed(qs,value){
  // filter for subset of programmes that are audio-described
  // filter for programmes that are audio-described
  // /nitro/api/programmes?audio_described=true
  // filter for programmes that are not audio-described
  // /nitro/api/programmes?audio_described=false
  qs=qs+'&audio_described=value';
  return qs;
},
fProgrammesAvailability : function fProgrammesAvailability(qs,value){
  // filter for subset of programmes that have availability
  // filter for programmes that are available
  // /nitro/api/programmes?availability=available
  // filter for programmes that are expected to become available imminently
  // /nitro/api/programmes?availability=pending
  qs=qs+'&availability=value';
  return qs;
},
fProgrammesAvailabilityEntityType : function fProgrammesAvailabilityEntityType(qs,value){
  // additional filter when availability=available
  // filter for programmes with available episodes
  // /nitro/api/programmes?availability_entity_type=episode
  // filter for programmes with available clips
  // /nitro/api/programmes?availability_entity_type=clip
  qs=qs+'&availability_entity_type=value';
  return qs;
},
fProgrammesChildrenOf : function fProgrammesChildrenOf(qs,value){
  // filter for subset of programmes that have PID as immediate parent
  qs=qs+'&children_of=value';
  return qs;
},
fProgrammesDescendantsOf : function fProgrammesDescendantsOf(qs,value){
  // filter for subset of programmes that have PID as ancestor
  qs=qs+'&descendants_of=value';
  return qs;
},
fProgrammesDuration : function fProgrammesDuration(qs,value){
  // filter for subset of programmes that have given duration
  // filter for programmes that have short duration (< 5m)
  // /nitro/api/programmes?duration=short
  // filter for programmes that have medium duration (5m - 30m)
  // /nitro/api/programmes?duration=medium
  // filter for programmes that have long duration (> 30m)
  // /nitro/api/programmes?duration=long
  qs=qs+'&duration=value';
  return qs;
},
fProgrammesEntityType : function fProgrammesEntityType(qs,value){
  // filter for subset of programmes that have given entity type
  // filter for programmes that are brands
  // /nitro/api/programmes?entity_type=brand
  // filter for programmes that are series
  // /nitro/api/programmes?entity_type=series
  // filter for programmes that are episodes
  // /nitro/api/programmes?entity_type=episode
  // filter for programmes that are clips
  // /nitro/api/programmes?entity_type=clip
  qs=qs+'&entity_type=value';
  return qs;
},
fProgrammesFormat : function fProgrammesFormat(qs,value){
  // filter for subset of programmes with format
  qs=qs+'&format=value';
  return qs;
},
fProgrammesGenre : function fProgrammesGenre(qs,value){
  // filter for subset of programmes with genre
  qs=qs+'&genre=value';
  return qs;
},
fProgrammesGroup : function fProgrammesGroup(qs,value){
  // filter for subset of programmes which belong to the given group pid
  qs=qs+'&group=value';
  return qs;
},
fProgrammesInitialLetter : function fProgrammesInitialLetter(qs,value){
  // filter for subset of programmes with title beginning with initial letter librarian style (ignoring leading 'The', 'An' (Welsh), etc) 0-9 a-z
  qs=qs+'&initial_letter=value';
  return qs;
},
fProgrammesInitialLetterEnd : function fProgrammesInitialLetterEnd(qs,value){
  // Programmes with (librarian) titles whose initial letter is equal/before given letter. Use with initial_letter_start for a range
  qs=qs+'&initial_letter_end=value';
  return qs;
},
fProgrammesInitialLetterStart : function fProgrammesInitialLetterStart(qs,value){
  // Programmes with (librarian) titles whose initial letter is equal/after given letter. Use with initial_letter_end for range.
  qs=qs+'&initial_letter_start=value';
  return qs;
},
fProgrammesInitialLetterStrict : function fProgrammesInitialLetterStrict(qs,value){
  // filter for subset of programmes with title beginning with initial letter
  qs=qs+'&initial_letter_strict=value';
  return qs;
},
fProgrammesItem : function fProgrammesItem(qs,value){
  // filter for subset of programmes with linked to versions which have the given item pids
  qs=qs+'&item=value';
  return qs;
},
fProgrammesMasterBrand : function fProgrammesMasterBrand(qs,value){
  // filter for subset of programmes with master_brand
  qs=qs+'&master_brand=value';
  return qs;
},
fProgrammesMediaSet : function fProgrammesMediaSet(qs,value){
  // filter for subset of programmes with media set
  qs=qs+'&media_set=value';
  return qs;
},
fProgrammesMediaType : function fProgrammesMediaType(qs,value){
  // filter for subset of programmes with media type
  // filter for programmes that are audio only
  // /nitro/api/programmes?media_type=audio
  // filter for programmes that are video only
  // /nitro/api/programmes?media_type=audio_video
  qs=qs+'&media_type=value';
  return qs;
},
fProgrammesPage : function fProgrammesPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fProgrammesPageSize : function fProgrammesPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fProgrammesPartnerId : function fProgrammesPartnerId(qs,value){
  // filter for programmes by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fProgrammesPartnerPid : function fProgrammesPartnerPid(qs,value){
  // filter for programmes by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fProgrammesPeople : function fProgrammesPeople(qs,value){
  // filter for subset of programmes with contributions by given people PID
  qs=qs+'&people=value';
  return qs;
},
fProgrammesPid : function fProgrammesPid(qs,value){
  // filter for subset of programmes having given PID
  qs=qs+'&pid=value';
  return qs;
},
fProgrammesPromotedFor : function fProgrammesPromotedFor(qs,value){
  // filter for subset of programmes which are promoted for given service
  qs=qs+'&promoted_for=value';
  return qs;
},
fProgrammesQ : function fProgrammesQ(qs,value){
  // filter for subset of programmes matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fProgrammesSigned : function fProgrammesSigned(qs,value){
  // filter for subset of programmes that are signed
  // filter for programmes that are signed
  // /nitro/api/programmes?signed=exclusive
  // filter for programmes regardless of signedness
  // /nitro/api/programmes?signed=inclusive
  // filter for programmes that are not signed
  // /nitro/api/programmes?signed=exclude
  qs=qs+'&signed=value';
  return qs;
},
fProgrammesTagName : function fProgrammesTagName(qs,value){
  // filter for subset of programmes with tag
  qs=qs+'&tag_name=value';
  return qs;
},
fProgrammesTagScheme : function fProgrammesTagScheme(qs,value){
  // filter for subset of programmes with a tag
  qs=qs+'&tag_scheme=value';
  return qs;
},
fProgrammesTleo : function fProgrammesTleo(qs,value){
  // filter for subset of programmes that are TLEOs
  // filter for programmes that are TLEOs
  // /nitro/api/programmes?tleo=true
  // filter for programmes that are not TLEOs
  // /nitro/api/programmes?tleo=false
  qs=qs+'&tleo=value';
  return qs;
},
fProgrammesVersion : function fProgrammesVersion(qs,value){
  // filter for subset of programmes with given PID as one of their versions
  qs=qs+'&version=value';
  return qs;
},
sAvailabilityScheduledStartAscending : function sAvailabilityScheduledStartAscending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/availabilities?sort=scheduled_start&sort_direction=ascending
  qs=qs+'&sort=scheduled_start&sort-direction=ascending';
  return qs;
},
sAvailabilityScheduledStartDescending : function sAvailabilityScheduledStartDescending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/availabilities?sort=scheduled_start&sort_direction=descending
  qs=qs+'&sort=scheduled_start&sort-direction=descending';
  return qs;
},
fAvailabilityAvailability : function fAvailabilityAvailability(qs,value){
  // filter for subset of availabilities
  // filter for availabilities that are available
  // /nitro/api/availabilities?availability=available
  qs=qs+'&availability=value';
  return qs;
},
fAvailabilityDescendantsOf : function fAvailabilityDescendantsOf(qs,value){
  // filter for subset of availabilities that have PID as ancestor
  qs=qs+'&descendants_of=value';
  return qs;
},
fAvailabilityMediaSet : function fAvailabilityMediaSet(qs,value){
  // filter for subset of availabilities with media set
  qs=qs+'&media_set=value';
  return qs;
},
fAvailabilityPage : function fAvailabilityPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fAvailabilityPageSize : function fAvailabilityPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fAvailabilityTerritory : function fAvailabilityTerritory(qs,value){
  // filter for availabilities in given territory
  // filter for only UK availabilities
  // /nitro/api/availabilities?territory=uk
  // filter for only non-UK availabilities
  // /nitro/api/availabilities?territory=nonuk
  // filter for global availabilities
  // /nitro/api/availabilities?territory=world
  qs=qs+'&territory=value';
  return qs;
},
sBroadcastsStartDateAscending : function sBroadcastsStartDateAscending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/broadcasts?sort=start_date&sort_direction=ascending
  qs=qs+'&sort=start_date&sort-direction=ascending';
  return qs;
},
sBroadcastsStartDateDescending : function sBroadcastsStartDateDescending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/broadcasts?sort=start_date&sort_direction=descending
  qs=qs+'&sort=start_date&sort-direction=descending';
  return qs;
},
mBroadcastsTitles : function mBroadcastsTitles(qs){
  // return ancestor programme titles
  // /nitro/api/broadcasts?mixin=titles
  qs=qs+'&mixin=titles';
  return qs;
},
fBroadcastsAuthority : function fBroadcastsAuthority(qs,value){
  // filter for subset of broadcasts that have given authority
  qs=qs+'&authority=value';
  return qs;
},
fBroadcastsDescendantsOf : function fBroadcastsDescendantsOf(qs,value){
  // filter for subset of broadcasts that are descendants of the given programme PID
  qs=qs+'&descendants_of=value';
  return qs;
},
fBroadcastsEndFrom : function fBroadcastsEndFrom(qs,value){
  // filter for subset of broadcasts that end on or later than the specified datetime
  qs=qs+'&end_from=value';
  return qs;
},
fBroadcastsEndTo : function fBroadcastsEndTo(qs,value){
  // filter for subset of broadcasts that end on or earlier than the specified datetime
  qs=qs+'&end_to=value';
  return qs;
},
fBroadcastsFormat : function fBroadcastsFormat(qs,value){
  // filter for subset of broadcasts that are classified in the given format ID
  qs=qs+'&format=value';
  return qs;
},
fBroadcastsGenre : function fBroadcastsGenre(qs,value){
  // filter for subset of broadcasts that are classified in the given genre ID
  qs=qs+'&genre=value';
  return qs;
},
fBroadcastsId : function fBroadcastsId(qs,value){
  // filter for subset of broadcasts that have given identifier
  qs=qs+'&id=value';
  return qs;
},
fBroadcastsItem : function fBroadcastsItem(qs,value){
  // filter for subset of broadcasts with the given item performed on it
  qs=qs+'&item=value';
  return qs;
},
fBroadcastsPage : function fBroadcastsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fBroadcastsPageSize : function fBroadcastsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fBroadcastsPeople : function fBroadcastsPeople(qs,value){
  // filter for subset of broadcasts that have given contributor
  qs=qs+'&people=value';
  return qs;
},
fBroadcastsPid : function fBroadcastsPid(qs,value){
  // filter for subset of broadcasts having given PID
  qs=qs+'&pid=value';
  return qs;
},
fBroadcastsQ : function fBroadcastsQ(qs,value){
  // filter for subset of broadcasts matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fBroadcastsScheduleDay : function fBroadcastsScheduleDay(qs,value){
  // filter for subset of broadcasts that start on the specified day (BBC time)
  qs=qs+'&schedule_day=value';
  return qs;
},
fBroadcastsScheduleDayFrom : function fBroadcastsScheduleDayFrom(qs,value){
  // filter for subset of broadcasts that start on or after the specified day (BBC time)
  qs=qs+'&schedule_day_from=value';
  return qs;
},
fBroadcastsScheduleDayTo : function fBroadcastsScheduleDayTo(qs,value){
  // filter for subset of broadcasts that start on or before the specified day (BBC time)
  qs=qs+'&schedule_day_to=value';
  return qs;
},
fBroadcastsServiceMasterBrand : function fBroadcastsServiceMasterBrand(qs,value){
  // filter for subset of broadcasts with given service master brand
  qs=qs+'&service_master_brand=value';
  return qs;
},
fBroadcastsSid : function fBroadcastsSid(qs,value){
  // filter for subset of broadcasts that are on the specified linear service
  qs=qs+'&sid=value';
  return qs;
},
fBroadcastsStartFrom : function fBroadcastsStartFrom(qs,value){
  // filter for subset of broadcasts that start on or later than the specified datetime
  qs=qs+'&start_from=value';
  return qs;
},
fBroadcastsStartTo : function fBroadcastsStartTo(qs,value){
  // filter for subset of broadcasts that start on or earlier than the specified datetime
  qs=qs+'&start_to=value';
  return qs;
},
fBroadcastsVersion : function fBroadcastsVersion(qs,value){
  // filter for subset of broadcasts with given PID as their parent version
  qs=qs+'&version=value';
  return qs;
},
sGroupsPidDescending : function sGroupsPidDescending(qs){
  // sort alphabetically by PID
  // /nitro/api/groups?sort=pid&sort_direction=descending
  qs=qs+'&sort=pid&sort-direction=descending';
  return qs;
},
mGroupsAlternateImages : function mGroupsAlternateImages(qs){
  // mixin to return the alternate images for a group
  // /nitro/api/groups?mixin=alternate_images
  qs=qs+'&mixin=alternate_images';
  return qs;
},
mGroupsGroupFor : function mGroupsGroupFor(qs){
  // mixin to return links to programme entities that group belongs to
  // /nitro/api/groups?mixin=group_for
  qs=qs+'&mixin=group_for';
  return qs;
},
mGroupsImages : function mGroupsImages(qs){
  // mixin to add image information for a group
  // /nitro/api/groups?mixin=images
  qs=qs+'&mixin=images';
  return qs;
},
mGroupsRelatedLinks : function mGroupsRelatedLinks(qs){
  // mixin to return related links for the group
  // /nitro/api/groups?mixin=related_links
  qs=qs+'&mixin=related_links';
  return qs;
},
fGroupsForDescendantsOf : function fGroupsForDescendantsOf(qs,value){
  // filter for groups related to given programme or its descendants
  qs=qs+'&for_descendants_of=value';
  return qs;
},
fGroupsForProgramme : function fGroupsForProgramme(qs,value){
  // filter for subset of groups directly related to a given programme
  qs=qs+'&for_programme=value';
  return qs;
},
fGroupsGroup : function fGroupsGroup(qs,value){
  // filter for subset of groups which belong to the given group pid
  qs=qs+'&group=value';
  return qs;
},
fGroupsGroupType : function fGroupsGroupType(qs,value){
  // filter for subset of groups that have the given group type
  // filter for groups that are collections
  // /nitro/api/groups?group_type=collection
  // filter for groups that are franchises
  // /nitro/api/groups?group_type=franchise
  // filter for groups that are galleries
  // /nitro/api/groups?group_type=gallery
  // filter for groups that are seasons
  // /nitro/api/groups?group_type=season
  qs=qs+'&group_type=value';
  return qs;
},
fGroupsMember : function fGroupsMember(qs,value){
  // filter for subset of groups which contain an entity with the given pid as a member
  qs=qs+'&member=value';
  return qs;
},
fGroupsPage : function fGroupsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fGroupsPageSize : function fGroupsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fGroupsPartnerId : function fGroupsPartnerId(qs,value){
  // filter for groups by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fGroupsPartnerPid : function fGroupsPartnerPid(qs,value){
  // filter for groups by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fGroupsPid : function fGroupsPid(qs,value){
  // filter for subset of seasons, collections, galleries or franchises having given PID
  qs=qs+'&pid=value';
  return qs;
},
fGroupsQ : function fGroupsQ(qs,value){
  // filter for subset of groups matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
sImagesGroupPositionAscending : function sImagesGroupPositionAscending(qs){
  // sort numerically by position, ascending only
  // /nitro/api/images?sort=group_position&sort_direction=ascending
  qs=qs+'&sort=group_position&sort-direction=ascending';
  return qs;
},
sImagesPidAscending : function sImagesPidAscending(qs){
  // sort alphabetically by PID
  // /nitro/api/images?sort=pid&sort_direction=ascending
  qs=qs+'&sort=pid&sort-direction=ascending';
  return qs;
},
sImagesPidDescending : function sImagesPidDescending(qs){
  // sort alphabetically by PID
  // /nitro/api/images?sort=pid&sort_direction=descending
  qs=qs+'&sort=pid&sort-direction=descending';
  return qs;
},
fImagesGroup : function fImagesGroup(qs,value){
  // filter for images belonging to the given group (i.e. Gallery)
  qs=qs+'&group=value';
  return qs;
},
fImagesImageType : function fImagesImageType(qs,value){
  // filter for images by type
  // select standard type images
  // /nitro/api/images?image_type=standard
  // select podcast type images
  // /nitro/api/images?image_type=podcast
  // select store type images
  // /nitro/api/images?image_type=store
  // select portrait type images
  // /nitro/api/images?image_type=portrait
  // select letterbox type images
  // /nitro/api/images?image_type=letterbox
  qs=qs+'&image_type=value';
  return qs;
},
fImagesIsAlternateImageFor : function fImagesIsAlternateImageFor(qs,value){
  // filter for alternate images by entity PID
  qs=qs+'&is_alternate_image_for=value';
  return qs;
},
fImagesIsImageFor : function fImagesIsImageFor(qs,value){
  // filter for images by entity PID
  qs=qs+'&is_image_for=value';
  return qs;
},
fImagesPage : function fImagesPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fImagesPageSize : function fImagesPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fImagesPartnerId : function fImagesPartnerId(qs,value){
  // filter for images by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fImagesPartnerPid : function fImagesPartnerPid(qs,value){
  // filter for images by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fImagesPid : function fImagesPid(qs,value){
  // filter for subset of images having given PID
  qs=qs+'&pid=value';
  return qs;
},
fImagesQ : function fImagesQ(qs,value){
  // filter for subset of images matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
sItemsPidDescending : function sItemsPidDescending(qs){
  // sort by pid, descending
  // /nitro/api/items?sort=pid&sort_direction=descending
  qs=qs+'&sort=pid&sort-direction=descending';
  return qs;
},
mItemsContributions : function mItemsContributions(qs){
  // mixin to return information about contributors to items
  // /nitro/api/items?mixin=contributions
  qs=qs+'&mixin=contributions';
  return qs;
},
mItemsImages : function mItemsImages(qs){
  // mixin to add image information for an item
  // /nitro/api/items?mixin=images
  qs=qs+'&mixin=images';
  return qs;
},
mItemsPlayEvent : function mItemsPlayEvent(qs){
  // mixin to return programme segment events, works in conjunction with programme or segment_event filters
  qs=qs+'&mixin=play_event';
  return qs;
},
fItemsAuthority : function fItemsAuthority(qs,value){
  // filter for subset of items that have an ID issued by the given authority
  qs=qs+'&authority=value';
  return qs;
},
fItemsId : function fItemsId(qs,value){
  // filter for subset of items having given ID
  qs=qs+'&id=value';
  return qs;
},
fItemsIdType : function fItemsIdType(qs,value){
  // filter for subset of items that have given an ID of the given type
  qs=qs+'&id_type=value';
  return qs;
},
fItemsItemType : function fItemsItemType(qs,value){
  // filter for specific type(s) of items
  // filter for only chapter items
  // /nitro/api/items?item_type=chapter
  // filter for only highlight items
  // /nitro/api/items?item_type=highlight
  // filter for only music items
  // /nitro/api/items?item_type=music
  // filter for only speech items
  // /nitro/api/items?item_type=speech
  // filter for only other items
  // /nitro/api/items?item_type=other
  qs=qs+'&item_type=value';
  return qs;
},
fItemsPage : function fItemsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fItemsPageSize : function fItemsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fItemsPartnerId : function fItemsPartnerId(qs,value){
  // filter for items by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fItemsPartnerPid : function fItemsPartnerPid(qs,value){
  // filter for items by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fItemsPeople : function fItemsPeople(qs,value){
  // filter for subset of items that have specified person involved
  qs=qs+'&people=value';
  return qs;
},
fItemsPid : function fItemsPid(qs,value){
  // filter for subset of items matching one of the given PIDs
  qs=qs+'&pid=value';
  return qs;
},
fItemsProgramme : function fItemsProgramme(qs,value){
  // filter for subset of items that are part of the given programme
  qs=qs+'&programme=value';
  return qs;
},
fItemsQ : function fItemsQ(qs,value){
  // filter for subset of items matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fItemsSegmentEvent : function fItemsSegmentEvent(qs,value){
  // filter for item with the given segment_event
  qs=qs+'&segment_event=value';
  return qs;
},
sMasterbrandsMidAscending : function sMasterbrandsMidAscending(qs){
  // sort by mid, ascending
  // /nitro/api/master_brands?sort=mid&sort_direction=ascending
  qs=qs+'&sort=mid&sort-direction=ascending';
  return qs;
},
mMasterbrandsImages : function mMasterbrandsImages(qs){
  // mixin to add image information for a masterbrand
  // /nitro/api/master_brands?mixin=images
  qs=qs+'&mixin=images';
  return qs;
},
fMasterbrandsMid : function fMasterbrandsMid(qs,value){
  // filter for subset of masterbrands that have given identifier
  qs=qs+'&mid=value';
  return qs;
},
fMasterbrandsPage : function fMasterbrandsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fMasterbrandsPageSize : function fMasterbrandsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fMasterbrandsPartnerId : function fMasterbrandsPartnerId(qs,value){
  // filter for masterbrands by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fMasterbrandsPartnerPid : function fMasterbrandsPartnerPid(qs,value){
  // filter for masterbrands by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fMasterbrandsQ : function fMasterbrandsQ(qs,value){
  // filter for subset of masterbrands matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fPeopleAuthority : function fPeopleAuthority(qs,value){
  // filter for subset of people that have an ID issued by the given authority
  qs=qs+'&authority=value';
  return qs;
},
fPeopleHasExternalId : function fPeopleHasExternalId(qs,value){
  // filter for people who have an external identifier
  // filter for people who have an external identifier
  // /nitro/api/people?has_external_id=true
  // filter for people who do not have an external identifier
  // /nitro/api/people?has_external_id=false
  qs=qs+'&has_external_id=value';
  return qs;
},
fPeopleId : function fPeopleId(qs,value){
  // filter for subset of people having given ID
  qs=qs+'&id=value';
  return qs;
},
fPeopleIdType : function fPeopleIdType(qs,value){
  // filter for subset of people that have given an ID of the given type
  qs=qs+'&id_type=value';
  return qs;
},
fPeoplePage : function fPeoplePage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fPeoplePageSize : function fPeoplePageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fPeoplePartnerId : function fPeoplePartnerId(qs,value){
  // filter for people by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fPeoplePartnerPid : function fPeoplePartnerPid(qs,value){
  // filter for people by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fPeoplePid : function fPeoplePid(qs,value){
  // filter for subset of people having given PID
  qs=qs+'&pid=value';
  return qs;
},
fPeopleProgramme : function fPeopleProgramme(qs,value){
  // filter for subset of people that have contributed to the given programme pid
  qs=qs+'&programme=value';
  return qs;
},
fPeopleQ : function fPeopleQ(qs,value){
  // filter for subset of people matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fPipsPage : function fPipsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fPipsPageSize : function fPipsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fPipsQ : function fPipsQ(qs,value){
  // filter for subset of programmes matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
mPromotionsRelatedLinks : function mPromotionsRelatedLinks(qs){
  // mixin to return information about related links to a promotion
  // /nitro/api/promotions?mixin=related_links
  qs=qs+'&mixin=related_links';
  return qs;
},
fPromotionsContext : function fPromotionsContext(qs,value){
  // filter for subset of promotions belonging to a given context
  qs=qs+'&context=value';
  return qs;
},
fPromotionsPage : function fPromotionsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fPromotionsPageSize : function fPromotionsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fPromotionsPartnerId : function fPromotionsPartnerId(qs,value){
  // filter for promotions by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fPromotionsPartnerPid : function fPromotionsPartnerPid(qs,value){
  // filter for promotions by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fPromotionsPid : function fPromotionsPid(qs,value){
  // filter for subset of promotions having given PID
  qs=qs+'&pid=value';
  return qs;
},
fPromotionsPromotedBy : function fPromotionsPromotedBy(qs,value){
  // filter for subset of promotions having given promoted by
  qs=qs+'&promoted_by=value';
  return qs;
},
fPromotionsPromotedFor : function fPromotionsPromotedFor(qs,value){
  // filter for subset of promotions having given promoted for
  qs=qs+'&promoted_for=value';
  return qs;
},
fPromotionsQ : function fPromotionsQ(qs,value){
  // filter for subset of promotions matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fPromotionsStatus : function fPromotionsStatus(qs,value){
  // filter for subset of promotions with status
  // filter current promotions
  // /nitro/api/promotions?status=current
  qs=qs+'&status=value';
  return qs;
},
sSchedulesStartDateAscending : function sSchedulesStartDateAscending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/schedules?sort=start_date&sort_direction=ascending
  qs=qs+'&sort=start_date&sort-direction=ascending';
  return qs;
},
sSchedulesStartDateDescending : function sSchedulesStartDateDescending(qs){
  // sort chronologically by scheduled start time/date, ascending
  // /nitro/api/schedules?sort=start_date&sort_direction=descending
  qs=qs+'&sort=start_date&sort-direction=descending';
  return qs;
},
mSchedulesAncestorTitles : function mSchedulesAncestorTitles(qs){
  // return ancestor programme titles
  // /nitro/api/schedules?mixin=ancestor_titles
  qs=qs+'&mixin=ancestor_titles';
  return qs;
},
mSchedulesImages : function mSchedulesImages(qs){
  // mixin to add image information for broadcasts and webcasts
  // /nitro/api/schedules?mixin=images
  qs=qs+'&mixin=images';
  return qs;
},
fSchedulesAuthority : function fSchedulesAuthority(qs,value){
  // filter for subset of broadcasts and webcasts that have given authority
  qs=qs+'&authority=value';
  return qs;
},
fSchedulesDescendantsOf : function fSchedulesDescendantsOf(qs,value){
  // filter for subset of broadcasts and webcasts that are descendants of the given programme PID
  qs=qs+'&descendants_of=value';
  return qs;
},
fSchedulesEndFrom : function fSchedulesEndFrom(qs,value){
  // filter for subset of broadcasts and webcasts that end on or later than the specified datetime
  qs=qs+'&end_from=value';
  return qs;
},
fSchedulesEndTo : function fSchedulesEndTo(qs,value){
  // filter for subset of broadcasts and webcasts that end on or earlier than the specified datetime
  qs=qs+'&end_to=value';
  return qs;
},
fSchedulesFormat : function fSchedulesFormat(qs,value){
  // filter for subset of broadcasts and webcasts that are classified in the given format ID
  qs=qs+'&format=value';
  return qs;
},
fSchedulesGenre : function fSchedulesGenre(qs,value){
  // filter for subset of broadcasts and webcasts that are classified in the given genre ID
  qs=qs+'&genre=value';
  return qs;
},
fSchedulesGroup : function fSchedulesGroup(qs,value){
  // filter for subset of broadcasts and webcasts that have programmes in the given group
  qs=qs+'&group=value';
  return qs;
},
fSchedulesId : function fSchedulesId(qs,value){
  // filter for subset of broadcasts and webcasts that have given identifier
  qs=qs+'&id=value';
  return qs;
},
fSchedulesIdType : function fSchedulesIdType(qs,value){
  // filter for subset of broadcasts and webcasts that have given id type
  qs=qs+'&id_type=value';
  return qs;
},
fSchedulesItem : function fSchedulesItem(qs,value){
  // filter for subset of broadcasts and webcasts with the given item performed on it
  qs=qs+'&item=value';
  return qs;
},
fSchedulesPage : function fSchedulesPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fSchedulesPageSize : function fSchedulesPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fSchedulesPartnerId : function fSchedulesPartnerId(qs,value){
  // filter for broadcasts and webcasts by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fSchedulesPartnerPid : function fSchedulesPartnerPid(qs,value){
  // filter for broadcasts and webcasts by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fSchedulesPeople : function fSchedulesPeople(qs,value){
  // filter for subset of broadcasts and webcasts that have given contributor
  qs=qs+'&people=value';
  return qs;
},
fSchedulesPid : function fSchedulesPid(qs,value){
  // filter for subset of broadcasts and webcasts having given PID
  qs=qs+'&pid=value';
  return qs;
},
fSchedulesQ : function fSchedulesQ(qs,value){
  // filter for subset of broadcasts and webcasts matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fSchedulesRepeat : function fSchedulesRepeat(qs,value){
  // filter to show either only repeats or non-repeats
  qs=qs+'&repeat=value';
  return qs;
},
fSchedulesScheduleDay : function fSchedulesScheduleDay(qs,value){
  // filter for subset of broadcasts and webcasts that start on the specified day (BBC time)
  qs=qs+'&schedule_day=value';
  return qs;
},
fSchedulesScheduleDayFrom : function fSchedulesScheduleDayFrom(qs,value){
  // filter for subset of broadcasts and webcasts that start on or after the specified day (BBC time)
  qs=qs+'&schedule_day_from=value';
  return qs;
},
fSchedulesScheduleDayTo : function fSchedulesScheduleDayTo(qs,value){
  // filter for subset of broadcasts and webcasts that start on or before the specified day (BBC time)
  qs=qs+'&schedule_day_to=value';
  return qs;
},
fSchedulesServiceMasterBrand : function fSchedulesServiceMasterBrand(qs,value){
  // filter for subset of broadcasts and webcasts with given service master brand
  qs=qs+'&service_master_brand=value';
  return qs;
},
fSchedulesSid : function fSchedulesSid(qs,value){
  // filter for subset of broadcasts and webcasts that are on the specified linear service
  qs=qs+'&sid=value';
  return qs;
},
fSchedulesStartFrom : function fSchedulesStartFrom(qs,value){
  // filter for subset of broadcasts and webcasts that start on or later than the specified datetime
  qs=qs+'&start_from=value';
  return qs;
},
fSchedulesStartTo : function fSchedulesStartTo(qs,value){
  // filter for subset of broadcasts and webcasts that start on or earlier than the specified datetime
  qs=qs+'&start_to=value';
  return qs;
},
fSchedulesVersion : function fSchedulesVersion(qs,value){
  // filter for subset of broadcasts and webcasts with given PID as their parent version
  qs=qs+'&version=value';
  return qs;
},
fServicesEndFrom : function fServicesEndFrom(qs,value){
  // Return services that end on or later than the specified datetime
  qs=qs+'&end_from=value';
  return qs;
},
fServicesEndTo : function fServicesEndTo(qs,value){
  // filter for subset of broadcasts that end on or earlier than the specified datetime
  qs=qs+'&end_to=value';
  return qs;
},
fServicesMid : function fServicesMid(qs,value){
  // filter for services by masterbrand MID
  qs=qs+'&mid=value';
  return qs;
},
fServicesPage : function fServicesPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fServicesPageSize : function fServicesPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fServicesPartnerId : function fServicesPartnerId(qs,value){
  // filter for services by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fServicesPartnerPid : function fServicesPartnerPid(qs,value){
  // filter for services by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fServicesQ : function fServicesQ(qs,value){
  // filter for subset of services matching supplied keyword/phrase (boolean operators permitted)
  qs=qs+'&q=value';
  return qs;
},
fServicesServiceType : function fServicesServiceType(qs,value){
  // filter for specified type of linear services. one of: TV, Local Radio, National Radio, Regional Radio
  // Return only TV services
  // /nitro/api/services?service_type=TV
  // Return only Local Radio services
  // /nitro/api/services?service_type=Local+Radio
  // Return only National Radio services
  // /nitro/api/services?service_type=National+Radio
  // Return only Regional Radio services
  // /nitro/api/services?service_type=Regional+Radio
  // Return only Interactive services
  // /nitro/api/services?service_type=Interactive
  qs=qs+'&service_type=value';
  return qs;
},
fServicesSid : function fServicesSid(qs,value){
  // filter for specified linear service
  qs=qs+'&sid=value';
  return qs;
},
fServicesStartFrom : function fServicesStartFrom(qs,value){
  // Return services that start on or later than the specified datetime
  qs=qs+'&start_from=value';
  return qs;
},
fServicesStartTo : function fServicesStartTo(qs,value){
  // Return services that start earlier than the specified datetime
  qs=qs+'&start_to=value';
  return qs;
},
fVersionsAvailability : function fVersionsAvailability(qs,value){
  // filter for subset of versions that have availability
  // filter for versions that are available
  // /nitro/api/versions?availability=available
  qs=qs+'&availability=value';
  return qs;
},
fVersionsDescendantsOf : function fVersionsDescendantsOf(qs,value){
  // filter for subset of versions having given programme PID
  qs=qs+'&descendants_of=value';
  return qs;
},
fVersionsMediaSet : function fVersionsMediaSet(qs,value){
  // filter for subset of versions with availability in the given media set
  qs=qs+'&media_set=value';
  return qs;
},
fVersionsPage : function fVersionsPage(qs,value){
  // which page of results to return
  qs=qs+'&page=value';
  return qs;
},
fVersionsPageSize : function fVersionsPageSize(qs,value){
  // number of results in each page
  qs=qs+'&page_size=value';
  return qs;
},
fVersionsPartnerId : function fVersionsPartnerId(qs,value){
  // filter for versions by partner ID
  qs=qs+'&partner_id=value';
  return qs;
},
fVersionsPartnerPid : function fVersionsPartnerPid(qs,value){
  // filter for versions by partner PID
  qs=qs+'&partner_pid=value';
  return qs;
},
fVersionsPid : function fVersionsPid(qs,value){
  // filter for subset of versions having given PID
  qs=qs+'&pid=value';
  return qs;
},
nop : function nop() {}
}