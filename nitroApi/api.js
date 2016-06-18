/**
* Start here for programmes metadata: Brands, Series, Episodes and Clips
*/
const nitroProgrammes = '/nitro/api/programmes';
/**
* sort numerically by position in group, ascending
* /nitro/api/programmes?sort=group_position&sort_direction=ascending
* isDefault
*/
const sProgrammesGroupPositionAscending = 'sort=group_position&sort_direction=ascending';
/**
* sort alphabetically by PID, descending
* /nitro/api/programmes?sort=pid&sort_direction=ascending
*/
const sProgrammesPidAscending = 'sort=pid&sort_direction=ascending';
/**
* sort alphabetically by PID, descending
* /nitro/api/programmes?sort=pid&sort_direction=descending
* isDefault
*/
const sProgrammesPidDescending = 'sort=pid&sort_direction=descending';
/**
* sort numerically by position, ascending
* /nitro/api/programmes?sort=position&sort_direction=ascending
* isDefault
*/
const sProgrammesPositionAscending = 'sort=position&sort_direction=ascending';
/**
* sort numerically by position, ascending
* /nitro/api/programmes?sort=position&sort_direction=descending
*/
const sProgrammesPositionDescending = 'sort=position&sort_direction=descending';
/**
* sort by promotion rank, ascending
* note that this sort has no sort-direction
*/
const sProgrammesPromotion = 'sort=promotion';
/**
* sort chronologically by release date, descending
* /nitro/api/programmes?sort=release_date&sort_direction=ascending
*/
const sProgrammesReleaseDateAscending = 'sort=release_date&sort_direction=ascending';
/**
* sort chronologically by release date, descending
* /nitro/api/programmes?sort=release_date&sort_direction=descending
* isDefault
*/
const sProgrammesReleaseDateDescending = 'sort=release_date&sort_direction=descending';
/**
* sort by weighting of search term (use with q parameter)
* note that this sort has no sort-direction
*/
const sProgrammesRelevance = 'sort=relevance';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/programmes?sort=scheduled_start&sort_direction=ascending
* isDefault
*/
const sProgrammesScheduledStartAscending = 'sort=scheduled_start&sort_direction=ascending';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/programmes?sort=scheduled_start&sort_direction=descending
*/
const sProgrammesScheduledStartDescending = 'sort=scheduled_start&sort_direction=descending';
/**
* sort alphabetically by title, ascending
* /nitro/api/programmes?sort=strict_title&sort_direction=ascending
* isDefault
*/
const sProgrammesStrictTitleAscending = 'sort=strict_title&sort_direction=ascending';
/**
* sort alphabetically by title, ascending
* /nitro/api/programmes?sort=strict_title&sort_direction=descending
*/
const sProgrammesStrictTitleDescending = 'sort=strict_title&sort_direction=descending';
/**
* sort by title librarian style (ignoring leading 'The', 'A', etc), ascending
* /nitro/api/programmes?sort=title&sort_direction=ascending
* isDefault
*/
const sProgrammesTitleAscending = 'sort=title&sort_direction=ascending';
/**
* sort by title librarian style (ignoring leading 'The', 'A', etc), ascending
* /nitro/api/programmes?sort=title&sort_direction=descending
*/
const sProgrammesTitleDescending = 'sort=title&sort_direction=descending';
/**
* sort by root pid and then preorder tree sort. Requires entities to have release date.
* /nitro/api/programmes?sort=tree&sort_direction=ascending
*/
const sProgrammesTreeAscending = 'sort=tree&sort_direction=ascending';
/**
* sort by root pid and then preorder tree sort. Requires entities to have release date.
* /nitro/api/programmes?sort=tree&sort_direction=descending
* isDefault
*/
const sProgrammesTreeDescending = 'sort=tree&sort_direction=descending';
/**
* sort numerically by number of views (most popular first)
* /nitro/api/programmes?sort=views&sort_direction=ascending
*/
const sProgrammesViewsAscending = 'sort=views&sort_direction=ascending';
/**
* sort numerically by number of views (most popular first)
* /nitro/api/programmes?sort=views&sort_direction=descending
* isDefault
*/
const sProgrammesViewsDescending = 'sort=views&sort_direction=descending';
/**
* mixin to return the alternate images for a programme
* Dependency on filter tleo value: true
*/
const mProgrammesAlternateImages = 'mixin=alternate_images';
/**
* mixin to return ancestor programme titles
* /nitro/api/programmes?mixin=ancestor_titles
*/
const mProgrammesAncestorTitles = 'mixin=ancestor_titles';
/**
* mixin to return programme availability information
* depends_on = availability
*/
const mProgrammesAvailability = 'mixin=availability';
/**
* mixin to return information about programmes that are currently available on demand
* /nitro/api/programmes?mixin=available_versions
* is affected by filter payment_type (payment type filter)
*/
const mProgrammesAvailableVersions = 'mixin=available_versions';
/**
* mixin to return information about contributors to a programme
* /nitro/api/programmes?mixin=contributions
*/
const mProgrammesContributions = 'mixin=contributions';
/**
* mixin to return original version duration in programme concept entities
* /nitro/api/programmes?mixin=duration
*/
const mProgrammesDuration = 'mixin=duration';
/**
* mixin to return list of genre groupings
* /nitro/api/programmes?mixin=genre_groupings
* Prohibits mixin genre_groups
*/
const mProgrammesGenreGroupings = 'mixin=genre_groupings';
/**
* mixin to add image information for a programme
* /nitro/api/programmes?mixin=images
*/
const mProgrammesImages = 'mixin=images';
/**
* mixin to add embeddable information for a programme
* /nitro/api/programmes?mixin=is_embeddable
*/
const mProgrammesIsEmbeddable = 'mixin=is_embeddable';
/**
* mixin to return the programmes which appear before and after a programme (as determined by the sort applied in the request)
* Dependency on filter children_of
* Dependency on filter group
* Dependency on filter promoted_for
*/
const mProgrammesPreviousNext = 'mixin=previous_next';
/**
* mixin to return information about related links to a programme
* /nitro/api/programmes?mixin=related_links
*/
const mProgrammesRelatedLinks = 'mixin=related_links';
/**
* mixin to return information about programmes that are currently available as webcasts
* /nitro/api/programmes?unstable_mixin=available_webcasts&mixin=available_webcasts
*/
const mProgrammesAvailableWebcasts = 'unstable_mixin=available_webcasts&mixin=available_webcasts';
/**
* filter for subset of programmes that are audio-described
* type = boolean
* option: true, filter for programmes that are audio-described
*/
const fProgrammesAudioDescribedTrue = 'audio_described=true';
/**
* /nitro/api/programmes?audio_described=true
* option: false, filter for programmes that are not audio-described
*/
const fProgrammesAudioDescribedFalse = 'audio_described=false';
/**
* /nitro/api/programmes?audio_described=false
*/
const fProgrammesAudioDescribed = 'audio_described';
/**
* filter for subset of programmes that have availability
* type = string
* option: available, filter for programmes that are available
*/
const fProgrammesAvailabilityAvailable = 'availability=available';
/**
* /nitro/api/programmes?availability=available
* option: pending, filter for programmes that are expected to become available imminently
*/
const fProgrammesAvailabilityPending = 'availability=pending';
/**
* /nitro/api/programmes?availability=pending
*/
const fProgrammesAvailability = 'availability';
/**
* additional filter when availability=available
* type = string
* option: episode, filter for programmes with available episodes
*/
const fProgrammesAvailabilityEntityTypeEpisode = 'availability_entity_type=episode';
/**
* /nitro/api/programmes?availability_entity_type=episode
* option: clip, filter for programmes with available clips
*/
const fProgrammesAvailabilityEntityTypeClip = 'availability_entity_type=clip';
/**
* /nitro/api/programmes?availability_entity_type=clip
*/
const fProgrammesAvailabilityEntityType = 'availability_entity_type';
/**
* filter for a subset of programmes that are available for a given type
* type = string
* default = ondemand
* depends_on = availability
* option: ondemand, filters programmes based on availability type of ondemand
*/
const fProgrammesAvailabilityTypeOndemand = 'availability_type=ondemand';
/**
* option: webcast, filters programmes based on availability type of webcast
*/
const fProgrammesAvailabilityTypeWebcast = 'availability_type=webcast';
/**
*/
const fProgrammesAvailabilityType = 'availability_type';
/**
* filter for subset of programmes that have PID as immediate parent
* type = PID
*/
const fProgrammesChildrenOf = 'children_of';
/**
* filter for subset of programmes that have PID as ancestor
* type = PID
*/
const fProgrammesDescendantsOf = 'descendants_of';
/**
* filter for subset of programmes that have given duration
* type = string
* option: short, filter for programmes that have short duration (< 5m)
*/
const fProgrammesDurationShort = 'duration=short';
/**
* /nitro/api/programmes?duration=short
* option: medium, filter for programmes that have medium duration (5m - 30m)
*/
const fProgrammesDurationMedium = 'duration=medium';
/**
* /nitro/api/programmes?duration=medium
* option: long, filter for programmes that have long duration (> 30m)
*/
const fProgrammesDurationLong = 'duration=long';
/**
* /nitro/api/programmes?duration=long
*/
const fProgrammesDuration = 'duration';
/**
* filter for subset of programmes that have given entity type
* type = string
* option: brand, filter for programmes that are brands
*/
const fProgrammesEntityTypeBrand = 'entity_type=brand';
/**
* /nitro/api/programmes?entity_type=brand
* option: series, filter for programmes that are series
*/
const fProgrammesEntityTypeSeries = 'entity_type=series';
/**
* /nitro/api/programmes?entity_type=series
* option: episode, filter for programmes that are episodes
*/
const fProgrammesEntityTypeEpisode = 'entity_type=episode';
/**
* /nitro/api/programmes?entity_type=episode
* option: clip, filter for programmes that are clips
*/
const fProgrammesEntityTypeClip = 'entity_type=clip';
/**
* /nitro/api/programmes?entity_type=clip
*/
const fProgrammesEntityType = 'entity_type';
/**
* filter for subset of programmes with format
* type = string
*/
const fProgrammesFormat = 'format';
/**
* filter for subset of programmes with genre
* type = string
*/
const fProgrammesGenre = 'genre';
/**
* filter for subset of programmes which belong to the given group pid
* type = PID
*/
const fProgrammesGroup = 'group';
/**
* filter for subset of programmes with title beginning with initial letter librarian style (ignoring leading 'The', 'An' (Welsh), etc) 0-9 a-z
* type = character
*/
const fProgrammesInitialLetter = 'initial_letter';
/**
* Programmes with (librarian) titles whose initial letter is equal/before given letter. Use with initial_letter_start for a range
* type = character
*/
const fProgrammesInitialLetterEnd = 'initial_letter_end';
/**
* Programmes with (librarian) titles whose initial letter is equal/after given letter. Use with initial_letter_end for range.
* type = character
*/
const fProgrammesInitialLetterStart = 'initial_letter_start';
/**
* filter for subset of programmes with title beginning with initial letter
* type = character
*/
const fProgrammesInitialLetterStrict = 'initial_letter_strict';
/**
* filter for subset of programmes with linked to versions which have the given item pids
* type = PID
*/
const fProgrammesItem = 'item';
/**
* filter for subset of programmes with master_brand
* type = string
*/
const fProgrammesMasterBrand = 'master_brand';
/**
* filter for subset of programmes with media set
* type = string
*/
const fProgrammesMediaSet = 'media_set';
/**
* filter for subset of programmes with media type
* type = string
* option: audio, filter for programmes that are audio only
*/
const fProgrammesMediaTypeAudio = 'media_type=audio';
/**
* /nitro/api/programmes?media_type=audio
* option: audio_video, filter for programmes that are video only
*/
const fProgrammesMediaTypeAudioVideo = 'media_type=audio_video';
/**
* /nitro/api/programmes?media_type=audio_video
*/
const fProgrammesMediaType = 'media_type';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fProgrammesPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fProgrammesPageSize = 'page_size';
/**
* filter for programmes by partner ID
* type = PID
* prefer = partner_pid
*/
const fProgrammesPartnerId = 'partner_id';
/**
* filter for programmes by partner PID
* type = PID
* default = s0000001
*/
const fProgrammesPartnerPid = 'partner_pid';
/**
* filter for a subset of programmes that are of the given payment_type
* type = string
* default = free
* depends_on = availability
* option: free, filter for programmes with no payment_type or with type free
*/
const fProgrammesPaymentTypeFree = 'payment_type=free';
/**
* option: bbcstore, filter for programmes with payment_type bbcstore
*/
const fProgrammesPaymentTypeBbcstore = 'payment_type=bbcstore';
/**
* option: uscansvod, filter for programmes with payment_type uscansvod
*/
const fProgrammesPaymentTypeUscansvod = 'payment_type=uscansvod';
/**
*/
const fProgrammesPaymentType = 'payment_type';
/**
* filter for subset of programmes with contributions by given people PID
* type = PID
*/
const fProgrammesPeople = 'people';
/**
* filter for subset of programmes having given PID
* type = PID
*/
const fProgrammesPid = 'pid';
/**
* filter for subset of programmes which are promoted for given service
* type = string
*/
const fProgrammesPromotedFor = 'promoted_for';
/**
* filter for subset of programmes matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fProgrammesQ = 'q';
/**
* filter for subset of programmes that are signed
* type = string
* option: exclusive, filter for programmes that are signed
*/
const fProgrammesSignedExclusive = 'signed=exclusive';
/**
* /nitro/api/programmes?signed=exclusive
* option: inclusive, filter for programmes regardless of signedness
*/
const fProgrammesSignedInclusive = 'signed=inclusive';
/**
* /nitro/api/programmes?signed=inclusive
* option: exclude, filter for programmes that are not signed
*/
const fProgrammesSignedExclude = 'signed=exclude';
/**
* /nitro/api/programmes?signed=exclude
*/
const fProgrammesSigned = 'signed';
/**
* filter for subset of programmes with tag
* type = string
*/
const fProgrammesTagName = 'tag_name';
/**
* filter for subset of programmes with a tag
* type = string
*/
const fProgrammesTagScheme = 'tag_scheme';
/**
* filter for subset of programmes that are TLEOs
* type = boolean
* option: true, filter for programmes that are TLEOs
*/
const fProgrammesTleoTrue = 'tleo=true';
/**
* /nitro/api/programmes?tleo=true
* option: false, filter for programmes that are not TLEOs
*/
const fProgrammesTleoFalse = 'tleo=false';
/**
* /nitro/api/programmes?tleo=false
*/
const fProgrammesTleo = 'tleo';
/**
* filter for subset of programmes with given PID as one of their versions
* type = PID
*/
const fProgrammesVersion = 'version';
/**
* Discover details of on-demand availability for programmes and their versions
*/
const nitroAvailability = '/nitro/api/availabilities';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/availabilities?sort=scheduled_start&sort_direction=ascending
*/
const sAvailabilityScheduledStartAscending = 'sort=scheduled_start&sort_direction=ascending';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/availabilities?sort=scheduled_start&sort_direction=descending
* isDefault
*/
const sAvailabilityScheduledStartDescending = 'sort=scheduled_start&sort_direction=descending';
/**
* filter for subset of availabilities
* type = string
* option: available, filter for availabilities that are available
*/
const fAvailabilityAvailabilityAvailable = 'availability=available';
/**
* /nitro/api/availabilities?availability=available
*/
const fAvailabilityAvailability = 'availability';
/**
* filter for subset of availabilities that have PID as ancestor
* type = PID
*/
const fAvailabilityDescendantsOf = 'descendants_of';
/**
* filter for subset of availabilities with media set
* type = string
*/
const fAvailabilityMediaSet = 'media_set';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fAvailabilityPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fAvailabilityPageSize = 'page_size';
/**
* filter for availabilities in given territory
* type = string
* option: uk, filter for only UK availabilities
*/
const fAvailabilityTerritoryUk = 'territory=uk';
/**
* /nitro/api/availabilities?territory=uk
* option: nonuk, filter for only non-UK availabilities
*/
const fAvailabilityTerritoryNonuk = 'territory=nonuk';
/**
* /nitro/api/availabilities?territory=nonuk
* option: world, filter for global availabilities
*/
const fAvailabilityTerritoryWorld = 'territory=world';
/**
* /nitro/api/availabilities?territory=world
*/
const fAvailabilityTerritory = 'territory';
const xAvailabilityDebugTrue = 'debug=true';
const xAvailabilityDebug = 'debug';
/**
* Build schedules and find metadata for TV and radio broadcasts
*/
const nitroBroadcasts = '/nitro/api/broadcasts';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/broadcasts?sort=start_date&sort_direction=ascending
* isDefault
*/
const sBroadcastsStartDateAscending = 'sort=start_date&sort_direction=ascending';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/broadcasts?sort=start_date&sort_direction=descending
*/
const sBroadcastsStartDateDescending = 'sort=start_date&sort_direction=descending';
/**
* return ancestor programme titles
* /nitro/api/broadcasts?mixin=titles
*/
const mBroadcastsTitles = 'mixin=titles';
/**
* filter for subset of broadcasts that have given authority
* type = string
*/
const fBroadcastsAuthority = 'authority';
/**
* filter for subset of broadcasts that are descendants of the given programme PID
* type = PID
*/
const fBroadcastsDescendantsOf = 'descendants_of';
/**
* filter for subset of broadcasts that end on or later than the specified datetime
* type = datetime
*/
const fBroadcastsEndFrom = 'end_from';
/**
* filter for subset of broadcasts that end on or earlier than the specified datetime
* type = datetime
*/
const fBroadcastsEndTo = 'end_to';
/**
* filter for subset of broadcasts that are classified in the given format ID
* type = string
*/
const fBroadcastsFormat = 'format';
/**
* filter for subset of broadcasts that are classified in the given genre ID
* type = string
*/
const fBroadcastsGenre = 'genre';
/**
* filter for subset of broadcasts that have given identifier
* type = string
*/
const fBroadcastsId = 'id';
/**
* filter for subset of broadcasts with the given item performed on it
* type = PID
*/
const fBroadcastsItem = 'item';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fBroadcastsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fBroadcastsPageSize = 'page_size';
/**
* filter for subset of broadcasts that have given contributor
* type = string
*/
const fBroadcastsPeople = 'people';
/**
* filter for subset of broadcasts having given PID
* type = PID
*/
const fBroadcastsPid = 'pid';
/**
* filter for subset of broadcasts matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fBroadcastsQ = 'q';
/**
* filter for subset of broadcasts that start on the specified day (BBC time)
* type = date
*/
const fBroadcastsScheduleDay = 'schedule_day';
/**
* filter for subset of broadcasts that start on or after the specified day (BBC time)
* type = date
*/
const fBroadcastsScheduleDayFrom = 'schedule_day_from';
/**
* filter for subset of broadcasts that start on or before the specified day (BBC time)
* type = date
*/
const fBroadcastsScheduleDayTo = 'schedule_day_to';
/**
* filter for subset of broadcasts with given service master brand
* type = string
*/
const fBroadcastsServiceMasterBrand = 'service_master_brand';
/**
* filter for subset of broadcasts that are on the specified linear service
* type = string
*/
const fBroadcastsSid = 'sid';
/**
* filter for subset of broadcasts that start on or later than the specified datetime
* type = datetime
*/
const fBroadcastsStartFrom = 'start_from';
/**
* filter for subset of broadcasts that start on or earlier than the specified datetime
* type = datetime
*/
const fBroadcastsStartTo = 'start_to';
/**
* filter for subset of broadcasts with given PID as their parent version
* type = PID
*/
const fBroadcastsVersion = 'version';
/**
* Find metadata for curated groups: seasons, collections, galleries or franchises
*/
const nitroGroups = '/nitro/api/groups';
/**
* sort alphabetically by PID
* /nitro/api/groups?sort=pid&sort_direction=descending
* isDefault
*/
const sGroupsPidDescending = 'sort=pid&sort_direction=descending';
/**
* mixin to return the alternate images for a group
* /nitro/api/groups?mixin=alternate_images
*/
const mGroupsAlternateImages = 'mixin=alternate_images';
/**
* mixin to return links to programme entities that group belongs to
* /nitro/api/groups?mixin=group_for
*/
const mGroupsGroupFor = 'mixin=group_for';
/**
* mixin to add image information for a group
* /nitro/api/groups?mixin=images
*/
const mGroupsImages = 'mixin=images';
/**
* mixin to return related links for the group
* /nitro/api/groups?mixin=related_links
*/
const mGroupsRelatedLinks = 'mixin=related_links';
/**
* filter for groups related to given programme or its descendants
* type = PID
*/
const fGroupsForDescendantsOf = 'for_descendants_of';
/**
* filter for subset of groups directly related to a given programme
* type = PID
*/
const fGroupsForProgramme = 'for_programme';
/**
* filter for subset of groups which belong to the given group pid
* type = PID
*/
const fGroupsGroup = 'group';
/**
* filter for subset of groups that have the given group type
* type = string
* option: collection, filter for groups that are collections
*/
const fGroupsGroupTypeCollection = 'group_type=collection';
/**
* /nitro/api/groups?group_type=collection
* option: franchise, filter for groups that are franchises
*/
const fGroupsGroupTypeFranchise = 'group_type=franchise';
/**
* /nitro/api/groups?group_type=franchise
* option: gallery, filter for groups that are galleries
*/
const fGroupsGroupTypeGallery = 'group_type=gallery';
/**
* /nitro/api/groups?group_type=gallery
* option: season, filter for groups that are seasons
*/
const fGroupsGroupTypeSeason = 'group_type=season';
/**
* /nitro/api/groups?group_type=season
*/
const fGroupsGroupType = 'group_type';
/**
* filter for subset of groups which contain an entity with the given pid as a member
* type = PID
*/
const fGroupsMember = 'member';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fGroupsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fGroupsPageSize = 'page_size';
/**
* filter for groups by partner ID
* type = PID
* prefer = partner_pid
*/
const fGroupsPartnerId = 'partner_id';
/**
* filter for groups by partner PID
* type = PID
* default = s0000001
*/
const fGroupsPartnerPid = 'partner_pid';
/**
* filter for subset of seasons, collections, galleries or franchises having given PID
* type = PID
*/
const fGroupsPid = 'pid';
/**
* filter for subset of groups matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fGroupsQ = 'q';
/**
* Find metadata for images
*/
const nitroImages = '/nitro/api/images';
/**
* sort numerically by position, ascending only
* /nitro/api/images?sort=group_position&sort_direction=ascending
* isDefault
*/
const sImagesGroupPositionAscending = 'sort=group_position&sort_direction=ascending';
/**
* sort alphabetically by PID
* /nitro/api/images?sort=pid&sort_direction=ascending
*/
const sImagesPidAscending = 'sort=pid&sort_direction=ascending';
/**
* sort alphabetically by PID
* /nitro/api/images?sort=pid&sort_direction=descending
* isDefault
*/
const sImagesPidDescending = 'sort=pid&sort_direction=descending';
/**
* filter for images belonging to the given group (i.e. Gallery)
* type = PID
* Prohibits filter is_image_for
* Prohibits filter is_alternate_image_for
*/
const fImagesGroup = 'group';
/**
* filter for images by type
* type = string
* option: standard, select standard type images
*/
const fImagesImageTypeStandard = 'image_type=standard';
/**
* /nitro/api/images?image_type=standard
* option: podcast, select podcast type images
*/
const fImagesImageTypePodcast = 'image_type=podcast';
/**
* /nitro/api/images?image_type=podcast
* option: store, select store type images
*/
const fImagesImageTypeStore = 'image_type=store';
/**
* /nitro/api/images?image_type=store
* option: portrait, select portrait type images
*/
const fImagesImageTypePortrait = 'image_type=portrait';
/**
* /nitro/api/images?image_type=portrait
* option: letterbox, select letterbox type images
*/
const fImagesImageTypeLetterbox = 'image_type=letterbox';
/**
* /nitro/api/images?image_type=letterbox
*/
const fImagesImageType = 'image_type';
/**
* filter for alternate images by entity PID
* type = PID
* Prohibits filter is_image_for
* Prohibits filter group
*/
const fImagesIsAlternateImageFor = 'is_alternate_image_for';
/**
* filter for images by entity PID
* type = PID
* Prohibits filter group
* Prohibits filter is_alternate_image_for
*/
const fImagesIsImageFor = 'is_image_for';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fImagesPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fImagesPageSize = 'page_size';
/**
* filter for images by partner ID
* type = PID
* prefer = partner_pid
*/
const fImagesPartnerId = 'partner_id';
/**
* filter for images by partner PID
* type = PID
* default = s0000001
*/
const fImagesPartnerPid = 'partner_pid';
/**
* filter for subset of images having given PID
* type = PID
*/
const fImagesPid = 'pid';
/**
* filter for subset of images matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fImagesQ = 'q';
/**
* Look inside programmes to find segments: chapters, tracks and more
*/
const nitroItems = '/nitro/api/items';
/**
* sort by pid, descending
* /nitro/api/items?sort=pid&sort_direction=descending
* isDefault
*/
const sItemsPidDescending = 'sort=pid&sort_direction=descending';
/**
* mixin to return information about contributors to items
* /nitro/api/items?mixin=contributions
*/
const mItemsContributions = 'mixin=contributions';
/**
* mixin to add image information for an item
* /nitro/api/items?mixin=images
*/
const mItemsImages = 'mixin=images';
/**
* mixin to return programme segment events, works in conjunction with programme or segment_event filters
* Dependency on filter programme
* Dependency on filter segment_event
*/
const mItemsPlayEvent = 'mixin=play_event';
/**
* filter for subset of items that have an ID issued by the given authority
* type = string
*/
const fItemsAuthority = 'authority';
/**
* filter for subset of items having given ID
* type = ID
*/
const fItemsId = 'id';
/**
* filter for subset of items that have given an ID of the given type
* type = string
*/
const fItemsIdType = 'id_type';
/**
* filter for specific type(s) of items
* type = string
* option: chapter, filter for only chapter items
*/
const fItemsItemTypeChapter = 'item_type=chapter';
/**
* /nitro/api/items?item_type=chapter
* option: highlight, filter for only highlight items
*/
const fItemsItemTypeHighlight = 'item_type=highlight';
/**
* /nitro/api/items?item_type=highlight
* option: music, filter for only music items
*/
const fItemsItemTypeMusic = 'item_type=music';
/**
* /nitro/api/items?item_type=music
* option: speech, filter for only speech items
*/
const fItemsItemTypeSpeech = 'item_type=speech';
/**
* /nitro/api/items?item_type=speech
* option: other, filter for only other items
*/
const fItemsItemTypeOther = 'item_type=other';
/**
* /nitro/api/items?item_type=other
*/
const fItemsItemType = 'item_type';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fItemsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fItemsPageSize = 'page_size';
/**
* filter for items by partner ID
* type = PID
* prefer = partner_pid
*/
const fItemsPartnerId = 'partner_id';
/**
* filter for items by partner PID
* type = PID
* default = s0000001
*/
const fItemsPartnerPid = 'partner_pid';
/**
* filter for subset of items that have specified person involved
* type = string
*/
const fItemsPeople = 'people';
/**
* filter for subset of items matching one of the given PIDs
* type = PID
*/
const fItemsPid = 'pid';
/**
* filter for subset of items that are part of the given programme
* type = PID
*/
const fItemsProgramme = 'programme';
/**
* filter for subset of items matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fItemsQ = 'q';
/**
* filter for item with the given segment_event
* type = string
*/
const fItemsSegmentEvent = 'segment_event';
/**
* List all Master Brands
*/
const nitroMasterbrands = '/nitro/api/master_brands';
/**
* sort by mid, ascending
* /nitro/api/master_brands?sort=mid&sort_direction=ascending
* isDefault
*/
const sMasterbrandsMidAscending = 'sort=mid&sort_direction=ascending';
/**
* mixin to add image information for a masterbrand
* /nitro/api/master_brands?mixin=images
*/
const mMasterbrandsImages = 'mixin=images';
/**
* filter for subset of masterbrands that have given identifier
* type = string
*/
const fMasterbrandsMid = 'mid';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fMasterbrandsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fMasterbrandsPageSize = 'page_size';
/**
* filter for masterbrands by partner ID
* type = PID
* prefer = partner_pid
*/
const fMasterbrandsPartnerId = 'partner_id';
/**
* filter for masterbrands by partner PID
* type = PID
* default = s0000001
*/
const fMasterbrandsPartnerPid = 'partner_pid';
/**
* filter for subset of masterbrands matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fMasterbrandsQ = 'q';
/**
* Find the people behind and in programmes: cast, crew, guests and more
*/
const nitroPeople = '/nitro/api/people';
/**
* filter for subset of people that have an ID issued by the given authority
* type = string
*/
const fPeopleAuthority = 'authority';
/**
* filter for people who have an external identifier
* type = boolean
* option: true, filter for people who have an external identifier
*/
const fPeopleHasExternalIdTrue = 'has_external_id=true';
/**
* /nitro/api/people?has_external_id=true
* option: false, filter for people who do not have an external identifier
*/
const fPeopleHasExternalIdFalse = 'has_external_id=false';
/**
* /nitro/api/people?has_external_id=false
*/
const fPeopleHasExternalId = 'has_external_id';
/**
* filter for subset of people having given ID
* type = ID
*/
const fPeopleId = 'id';
/**
* filter for subset of people that have given an ID of the given type
* type = string
*/
const fPeopleIdType = 'id_type';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fPeoplePage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fPeoplePageSize = 'page_size';
/**
* filter for people by partner ID
* type = PID
* prefer = partner_pid
*/
const fPeoplePartnerId = 'partner_id';
/**
* filter for people by partner PID
* type = PID
* default = s0000001
*/
const fPeoplePartnerPid = 'partner_pid';
/**
* filter for subset of people having given PID
* type = PID
*/
const fPeoplePid = 'pid';
/**
* filter for subset of people that have contributed to the given programme pid
* type = string
*/
const fPeopleProgramme = 'programme';
/**
* filter for subset of people matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fPeopleQ = 'q';
/**
* Look inside pips entities
*/
const nitroPips = '/nitro/api/pips';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fPipsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fPipsPageSize = 'page_size';
/**
* filter for subset of programmes matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fPipsQ = 'q';
/**
* Discover metadata for content promotions
*/
const nitroPromotions = '/nitro/api/promotions';
/**
* mixin to return information about related links to a promotion
* /nitro/api/promotions?mixin=related_links
*/
const mPromotionsRelatedLinks = 'mixin=related_links';
/**
* filter for subset of promotions belonging to a given context
* type = PID
*/
const fPromotionsContext = 'context';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fPromotionsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fPromotionsPageSize = 'page_size';
/**
* filter for promotions by partner ID
* type = PID
* prefer = partner_pid
*/
const fPromotionsPartnerId = 'partner_id';
/**
* filter for promotions by partner PID
* type = PID
* default = s0000001
*/
const fPromotionsPartnerPid = 'partner_pid';
/**
* filter for subset of promotions having given PID
* type = PID
*/
const fPromotionsPid = 'pid';
/**
* filter for subset of promotions having given promoted by
* type = string
*/
const fPromotionsPromotedBy = 'promoted_by';
/**
* filter for subset of promotions having given promoted for
* type = string
*/
const fPromotionsPromotedFor = 'promoted_for';
/**
* filter for subset of promotions matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fPromotionsQ = 'q';
/**
* filter for subset of promotions with status
* type = string
* option: current, filter current promotions
*/
const fPromotionsStatusCurrent = 'status=current';
/**
* /nitro/api/promotions?status=current
*/
const fPromotionsStatus = 'status';
/**
* Build schedules and find metadata for TV and radio broadcasts and webcasts
*/
const nitroSchedules = '/nitro/api/schedules';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/schedules?sort=start_date&sort_direction=ascending
* isDefault
*/
const sSchedulesStartDateAscending = 'sort=start_date&sort_direction=ascending';
/**
* sort chronologically by scheduled start time/date, ascending
* /nitro/api/schedules?sort=start_date&sort_direction=descending
*/
const sSchedulesStartDateDescending = 'sort=start_date&sort_direction=descending';
/**
* return ancestor programme titles
* /nitro/api/schedules?mixin=ancestor_titles
*/
const mSchedulesAncestorTitles = 'mixin=ancestor_titles';
/**
* mixin to add image information for broadcasts and webcasts
* /nitro/api/schedules?mixin=images
*/
const mSchedulesImages = 'mixin=images';
/**
* filter for subset of broadcasts and webcasts that have given authority
* type = string
*/
const fSchedulesAuthority = 'authority';
/**
* filter for subset of broadcasts and webcasts that are descendants of the given programme PID
* type = PID
*/
const fSchedulesDescendantsOf = 'descendants_of';
/**
* filter for subset of broadcasts and webcasts that end on or later than the specified datetime
* type = datetime
*/
const fSchedulesEndFrom = 'end_from';
/**
* filter for subset of broadcasts and webcasts that end on or earlier than the specified datetime
* type = datetime
*/
const fSchedulesEndTo = 'end_to';
/**
* filter for subset of broadcasts and webcasts that are classified in the given format ID
* type = string
*/
const fSchedulesFormat = 'format';
/**
* filter for subset of broadcasts and webcasts that are classified in the given genre ID
* type = string
*/
const fSchedulesGenre = 'genre';
/**
* filter for subset of broadcasts and webcasts that have programmes in the given group
* type = PID
*/
const fSchedulesGroup = 'group';
/**
* filter for subset of broadcasts and webcasts that have given identifier
* type = string
*/
const fSchedulesId = 'id';
/**
* filter for subset of broadcasts and webcasts that have given id type
* type = string
*/
const fSchedulesIdType = 'id_type';
/**
* filter for subset of broadcasts and webcasts with the given item performed on it
* type = PID
*/
const fSchedulesItem = 'item';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fSchedulesPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fSchedulesPageSize = 'page_size';
/**
* filter for broadcasts and webcasts by partner ID
* type = PID
* prefer = partner_pid
*/
const fSchedulesPartnerId = 'partner_id';
/**
* filter for broadcasts and webcasts by partner PID
* type = PID
* default = s0000001
*/
const fSchedulesPartnerPid = 'partner_pid';
/**
* filter for subset of broadcasts and webcasts that have given contributor
* type = string
*/
const fSchedulesPeople = 'people';
/**
* filter for subset of broadcasts and webcasts having given PID
* type = PID
*/
const fSchedulesPid = 'pid';
/**
* filter for subset of broadcasts and webcasts matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fSchedulesQ = 'q';
/**
* filter to show either only repeats or non-repeats
* type = boolean
*/
const fSchedulesRepeat = 'repeat';
/**
* filter for subset of broadcasts and webcasts that start on the specified day (BBC time)
* type = date
*/
const fSchedulesScheduleDay = 'schedule_day';
/**
* filter for subset of broadcasts and webcasts that start on or after the specified day (BBC time)
* type = date
*/
const fSchedulesScheduleDayFrom = 'schedule_day_from';
/**
* filter for subset of broadcasts and webcasts that start on or before the specified day (BBC time)
* type = date
*/
const fSchedulesScheduleDayTo = 'schedule_day_to';
/**
* filter for subset of broadcasts and webcasts with given service master brand
* type = string
*/
const fSchedulesServiceMasterBrand = 'service_master_brand';
/**
* filter for subset of broadcasts and webcasts that are on the specified linear service
* type = string
*/
const fSchedulesSid = 'sid';
/**
* filter for subset of broadcasts and webcasts that start on or later than the specified datetime
* type = datetime
*/
const fSchedulesStartFrom = 'start_from';
/**
* filter for subset of broadcasts and webcasts that start on or earlier than the specified datetime
* type = datetime
*/
const fSchedulesStartTo = 'start_to';
/**
* filter for subset of broadcasts and webcasts with given PID as their parent version
* type = PID
*/
const fSchedulesVersion = 'version';
/**
* Information about the linear services used for broadcast transmissions
*/
const nitroServices = '/nitro/api/services';
/**
* Return services that end on or later than the specified datetime
* type = datetime
*/
const fServicesEndFrom = 'end_from';
/**
* filter for subset of broadcasts that end on or earlier than the specified datetime
* type = datetime
*/
const fServicesEndTo = 'end_to';
/**
* filter for services by masterbrand MID
* type = string
*/
const fServicesMid = 'mid';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fServicesPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fServicesPageSize = 'page_size';
/**
* filter for services by partner ID
* type = PID
* prefer = partner_pid
*/
const fServicesPartnerId = 'partner_id';
/**
* filter for services by partner PID
* type = PID
* default = s0000001
*/
const fServicesPartnerPid = 'partner_pid';
/**
* filter for subset of services matching supplied keyword/phrase (boolean operators permitted)
* type = string
*/
const fServicesQ = 'q';
/**
* filter for specified type of linear services. one of: TV, Local Radio, National Radio, Regional Radio
* type = string
* option: TV, Return only TV services
*/
const fServicesServiceTypeTv = 'service_type=TV';
/**
* /nitro/api/services?service_type=TV
* option: Local Radio, Return only Local Radio services
*/
const fServicesServiceTypeLocalRadio = 'service_type=Local%20Radio';
/**
* /nitro/api/services?service_type=Local+Radio
* option: National Radio, Return only National Radio services
*/
const fServicesServiceTypeNationalRadio = 'service_type=National%20Radio';
/**
* /nitro/api/services?service_type=National+Radio
* option: Regional Radio, Return only Regional Radio services
*/
const fServicesServiceTypeRegionalRadio = 'service_type=Regional%20Radio';
/**
* /nitro/api/services?service_type=Regional+Radio
* option: Interactive, Return only Interactive services
*/
const fServicesServiceTypeInteractive = 'service_type=Interactive';
/**
* /nitro/api/services?service_type=Interactive
*/
const fServicesServiceType = 'service_type';
/**
* filter for specified linear service
* type = string
*/
const fServicesSid = 'sid';
/**
* Return services that start on or later than the specified datetime
* type = datetime
*/
const fServicesStartFrom = 'start_from';
/**
* Return services that start earlier than the specified datetime
* type = datetime
*/
const fServicesStartTo = 'start_to';
/**
* Metadata on editorial programme versions: original, signed, audio-described, etc
*/
const nitroVersions = '/nitro/api/versions';
/**
* filter for subset of versions that have availability
* type = string
* option: available, filter for versions that are available
*/
const fVersionsAvailabilityAvailable = 'availability=available';
/**
* /nitro/api/versions?availability=available
*/
const fVersionsAvailability = 'availability';
/**
* filter for subset of versions having given programme PID
* type = PID
*/
const fVersionsDescendantsOf = 'descendants_of';
/**
* filter for subset of versions with availability in the given media set
* type = string
*/
const fVersionsMediaSet = 'media_set';
/**
* which page of results to return
* type = integer
* default = 1
* min_value = 1
*/
const fVersionsPage = 'page';
/**
* number of results in each page
* type = integer
* default = 10
* max_value = 300
*/
const fVersionsPageSize = 'page_size';
/**
* filter for versions by partner ID
* type = PID
* prefer = partner_pid
*/
const fVersionsPartnerId = 'partner_id';
/**
* filter for versions by partner PID
* type = PID
* default = s0000001
*/
const fVersionsPartnerPid = 'partner_pid';
/**
* filter for a subset of versions that are of the given payment_type
* type = string
* default = free
* depends_on = availability
* option: free, filter for versions with no payment_type or with type free
*/
const fVersionsPaymentTypeFree = 'payment_type=free';
/**
* option: bbcstore, filter for versions with payment_type bbcstore
*/
const fVersionsPaymentTypeBbcstore = 'payment_type=bbcstore';
/**
* option: uscansvod, filter for versions with payment_type uscansvod
*/
const fVersionsPaymentTypeUscansvod = 'payment_type=uscansvod';
/**
*/
const fVersionsPaymentType = 'payment_type';
/**
* filter for subset of versions having given PID
* type = PID
*/
const fVersionsPid = 'pid';
const apiHash = '0f676cccd5589c63f2c2263c540ed373f13268b3301c4bb9a7f258dac74285ad';

module.exports = {
nitroProgrammes : nitroProgrammes,
sProgrammesGroupPositionAscending : sProgrammesGroupPositionAscending,
sProgrammesPidAscending : sProgrammesPidAscending,
sProgrammesPidDescending : sProgrammesPidDescending,
sProgrammesPositionAscending : sProgrammesPositionAscending,
sProgrammesPositionDescending : sProgrammesPositionDescending,
sProgrammesPromotion : sProgrammesPromotion,
sProgrammesReleaseDateAscending : sProgrammesReleaseDateAscending,
sProgrammesReleaseDateDescending : sProgrammesReleaseDateDescending,
sProgrammesRelevance : sProgrammesRelevance,
sProgrammesScheduledStartAscending : sProgrammesScheduledStartAscending,
sProgrammesScheduledStartDescending : sProgrammesScheduledStartDescending,
sProgrammesStrictTitleAscending : sProgrammesStrictTitleAscending,
sProgrammesStrictTitleDescending : sProgrammesStrictTitleDescending,
sProgrammesTitleAscending : sProgrammesTitleAscending,
sProgrammesTitleDescending : sProgrammesTitleDescending,
sProgrammesTreeAscending : sProgrammesTreeAscending,
sProgrammesTreeDescending : sProgrammesTreeDescending,
sProgrammesViewsAscending : sProgrammesViewsAscending,
sProgrammesViewsDescending : sProgrammesViewsDescending,
mProgrammesAlternateImages : mProgrammesAlternateImages,
mProgrammesAncestorTitles : mProgrammesAncestorTitles,
mProgrammesAvailability : mProgrammesAvailability,
mProgrammesAvailableVersions : mProgrammesAvailableVersions,
mProgrammesContributions : mProgrammesContributions,
mProgrammesDuration : mProgrammesDuration,
mProgrammesGenreGroupings : mProgrammesGenreGroupings,
mProgrammesImages : mProgrammesImages,
mProgrammesIsEmbeddable : mProgrammesIsEmbeddable,
mProgrammesPreviousNext : mProgrammesPreviousNext,
mProgrammesRelatedLinks : mProgrammesRelatedLinks,
mProgrammesAvailableWebcasts : mProgrammesAvailableWebcasts,
fProgrammesAudioDescribedTrue : fProgrammesAudioDescribedTrue,
fProgrammesAudioDescribedFalse : fProgrammesAudioDescribedFalse,
fProgrammesAudioDescribed : fProgrammesAudioDescribed,
fProgrammesAvailabilityAvailable : fProgrammesAvailabilityAvailable,
fProgrammesAvailabilityPending : fProgrammesAvailabilityPending,
fProgrammesAvailability : fProgrammesAvailability,
fProgrammesAvailabilityEntityTypeEpisode : fProgrammesAvailabilityEntityTypeEpisode,
fProgrammesAvailabilityEntityTypeClip : fProgrammesAvailabilityEntityTypeClip,
fProgrammesAvailabilityEntityType : fProgrammesAvailabilityEntityType,
fProgrammesAvailabilityTypeOndemand : fProgrammesAvailabilityTypeOndemand,
fProgrammesAvailabilityTypeWebcast : fProgrammesAvailabilityTypeWebcast,
fProgrammesAvailabilityType : fProgrammesAvailabilityType,
fProgrammesChildrenOf : fProgrammesChildrenOf,
fProgrammesDescendantsOf : fProgrammesDescendantsOf,
fProgrammesDurationShort : fProgrammesDurationShort,
fProgrammesDurationMedium : fProgrammesDurationMedium,
fProgrammesDurationLong : fProgrammesDurationLong,
fProgrammesDuration : fProgrammesDuration,
fProgrammesEntityTypeBrand : fProgrammesEntityTypeBrand,
fProgrammesEntityTypeSeries : fProgrammesEntityTypeSeries,
fProgrammesEntityTypeEpisode : fProgrammesEntityTypeEpisode,
fProgrammesEntityTypeClip : fProgrammesEntityTypeClip,
fProgrammesEntityType : fProgrammesEntityType,
fProgrammesFormat : fProgrammesFormat,
fProgrammesGenre : fProgrammesGenre,
fProgrammesGroup : fProgrammesGroup,
fProgrammesInitialLetter : fProgrammesInitialLetter,
fProgrammesInitialLetterEnd : fProgrammesInitialLetterEnd,
fProgrammesInitialLetterStart : fProgrammesInitialLetterStart,
fProgrammesInitialLetterStrict : fProgrammesInitialLetterStrict,
fProgrammesItem : fProgrammesItem,
fProgrammesMasterBrand : fProgrammesMasterBrand,
fProgrammesMediaSet : fProgrammesMediaSet,
fProgrammesMediaTypeAudio : fProgrammesMediaTypeAudio,
fProgrammesMediaTypeAudioVideo : fProgrammesMediaTypeAudioVideo,
fProgrammesMediaType : fProgrammesMediaType,
fProgrammesPage : fProgrammesPage,
fProgrammesPageSize : fProgrammesPageSize,
fProgrammesPartnerId : fProgrammesPartnerId,
fProgrammesPartnerPid : fProgrammesPartnerPid,
fProgrammesPaymentTypeFree : fProgrammesPaymentTypeFree,
fProgrammesPaymentTypeBbcstore : fProgrammesPaymentTypeBbcstore,
fProgrammesPaymentTypeUscansvod : fProgrammesPaymentTypeUscansvod,
fProgrammesPaymentType : fProgrammesPaymentType,
fProgrammesPeople : fProgrammesPeople,
fProgrammesPid : fProgrammesPid,
fProgrammesPromotedFor : fProgrammesPromotedFor,
fProgrammesQ : fProgrammesQ,
fProgrammesSignedExclusive : fProgrammesSignedExclusive,
fProgrammesSignedInclusive : fProgrammesSignedInclusive,
fProgrammesSignedExclude : fProgrammesSignedExclude,
fProgrammesSigned : fProgrammesSigned,
fProgrammesTagName : fProgrammesTagName,
fProgrammesTagScheme : fProgrammesTagScheme,
fProgrammesTleoTrue : fProgrammesTleoTrue,
fProgrammesTleoFalse : fProgrammesTleoFalse,
fProgrammesTleo : fProgrammesTleo,
fProgrammesVersion : fProgrammesVersion,
nitroAvailability : nitroAvailability,
sAvailabilityScheduledStartAscending : sAvailabilityScheduledStartAscending,
sAvailabilityScheduledStartDescending : sAvailabilityScheduledStartDescending,
fAvailabilityAvailabilityAvailable : fAvailabilityAvailabilityAvailable,
fAvailabilityAvailability : fAvailabilityAvailability,
fAvailabilityDescendantsOf : fAvailabilityDescendantsOf,
fAvailabilityMediaSet : fAvailabilityMediaSet,
fAvailabilityPage : fAvailabilityPage,
fAvailabilityPageSize : fAvailabilityPageSize,
fAvailabilityTerritoryUk : fAvailabilityTerritoryUk,
fAvailabilityTerritoryNonuk : fAvailabilityTerritoryNonuk,
fAvailabilityTerritoryWorld : fAvailabilityTerritoryWorld,
fAvailabilityTerritory : fAvailabilityTerritory,
xAvailabilityDebugTrue : xAvailabilityDebugTrue,
xAvailabilityDebug : xAvailabilityDebug,
nitroBroadcasts : nitroBroadcasts,
sBroadcastsStartDateAscending : sBroadcastsStartDateAscending,
sBroadcastsStartDateDescending : sBroadcastsStartDateDescending,
mBroadcastsTitles : mBroadcastsTitles,
fBroadcastsAuthority : fBroadcastsAuthority,
fBroadcastsDescendantsOf : fBroadcastsDescendantsOf,
fBroadcastsEndFrom : fBroadcastsEndFrom,
fBroadcastsEndTo : fBroadcastsEndTo,
fBroadcastsFormat : fBroadcastsFormat,
fBroadcastsGenre : fBroadcastsGenre,
fBroadcastsId : fBroadcastsId,
fBroadcastsItem : fBroadcastsItem,
fBroadcastsPage : fBroadcastsPage,
fBroadcastsPageSize : fBroadcastsPageSize,
fBroadcastsPeople : fBroadcastsPeople,
fBroadcastsPid : fBroadcastsPid,
fBroadcastsQ : fBroadcastsQ,
fBroadcastsScheduleDay : fBroadcastsScheduleDay,
fBroadcastsScheduleDayFrom : fBroadcastsScheduleDayFrom,
fBroadcastsScheduleDayTo : fBroadcastsScheduleDayTo,
fBroadcastsServiceMasterBrand : fBroadcastsServiceMasterBrand,
fBroadcastsSid : fBroadcastsSid,
fBroadcastsStartFrom : fBroadcastsStartFrom,
fBroadcastsStartTo : fBroadcastsStartTo,
fBroadcastsVersion : fBroadcastsVersion,
nitroGroups : nitroGroups,
sGroupsPidDescending : sGroupsPidDescending,
mGroupsAlternateImages : mGroupsAlternateImages,
mGroupsGroupFor : mGroupsGroupFor,
mGroupsImages : mGroupsImages,
mGroupsRelatedLinks : mGroupsRelatedLinks,
fGroupsForDescendantsOf : fGroupsForDescendantsOf,
fGroupsForProgramme : fGroupsForProgramme,
fGroupsGroup : fGroupsGroup,
fGroupsGroupTypeCollection : fGroupsGroupTypeCollection,
fGroupsGroupTypeFranchise : fGroupsGroupTypeFranchise,
fGroupsGroupTypeGallery : fGroupsGroupTypeGallery,
fGroupsGroupTypeSeason : fGroupsGroupTypeSeason,
fGroupsGroupType : fGroupsGroupType,
fGroupsMember : fGroupsMember,
fGroupsPage : fGroupsPage,
fGroupsPageSize : fGroupsPageSize,
fGroupsPartnerId : fGroupsPartnerId,
fGroupsPartnerPid : fGroupsPartnerPid,
fGroupsPid : fGroupsPid,
fGroupsQ : fGroupsQ,
nitroImages : nitroImages,
sImagesGroupPositionAscending : sImagesGroupPositionAscending,
sImagesPidAscending : sImagesPidAscending,
sImagesPidDescending : sImagesPidDescending,
fImagesGroup : fImagesGroup,
fImagesImageTypeStandard : fImagesImageTypeStandard,
fImagesImageTypePodcast : fImagesImageTypePodcast,
fImagesImageTypeStore : fImagesImageTypeStore,
fImagesImageTypePortrait : fImagesImageTypePortrait,
fImagesImageTypeLetterbox : fImagesImageTypeLetterbox,
fImagesImageType : fImagesImageType,
fImagesIsAlternateImageFor : fImagesIsAlternateImageFor,
fImagesIsImageFor : fImagesIsImageFor,
fImagesPage : fImagesPage,
fImagesPageSize : fImagesPageSize,
fImagesPartnerId : fImagesPartnerId,
fImagesPartnerPid : fImagesPartnerPid,
fImagesPid : fImagesPid,
fImagesQ : fImagesQ,
nitroItems : nitroItems,
sItemsPidDescending : sItemsPidDescending,
mItemsContributions : mItemsContributions,
mItemsImages : mItemsImages,
mItemsPlayEvent : mItemsPlayEvent,
fItemsAuthority : fItemsAuthority,
fItemsId : fItemsId,
fItemsIdType : fItemsIdType,
fItemsItemTypeChapter : fItemsItemTypeChapter,
fItemsItemTypeHighlight : fItemsItemTypeHighlight,
fItemsItemTypeMusic : fItemsItemTypeMusic,
fItemsItemTypeSpeech : fItemsItemTypeSpeech,
fItemsItemTypeOther : fItemsItemTypeOther,
fItemsItemType : fItemsItemType,
fItemsPage : fItemsPage,
fItemsPageSize : fItemsPageSize,
fItemsPartnerId : fItemsPartnerId,
fItemsPartnerPid : fItemsPartnerPid,
fItemsPeople : fItemsPeople,
fItemsPid : fItemsPid,
fItemsProgramme : fItemsProgramme,
fItemsQ : fItemsQ,
fItemsSegmentEvent : fItemsSegmentEvent,
nitroMasterbrands : nitroMasterbrands,
sMasterbrandsMidAscending : sMasterbrandsMidAscending,
mMasterbrandsImages : mMasterbrandsImages,
fMasterbrandsMid : fMasterbrandsMid,
fMasterbrandsPage : fMasterbrandsPage,
fMasterbrandsPageSize : fMasterbrandsPageSize,
fMasterbrandsPartnerId : fMasterbrandsPartnerId,
fMasterbrandsPartnerPid : fMasterbrandsPartnerPid,
fMasterbrandsQ : fMasterbrandsQ,
nitroPeople : nitroPeople,
fPeopleAuthority : fPeopleAuthority,
fPeopleHasExternalIdTrue : fPeopleHasExternalIdTrue,
fPeopleHasExternalIdFalse : fPeopleHasExternalIdFalse,
fPeopleHasExternalId : fPeopleHasExternalId,
fPeopleId : fPeopleId,
fPeopleIdType : fPeopleIdType,
fPeoplePage : fPeoplePage,
fPeoplePageSize : fPeoplePageSize,
fPeoplePartnerId : fPeoplePartnerId,
fPeoplePartnerPid : fPeoplePartnerPid,
fPeoplePid : fPeoplePid,
fPeopleProgramme : fPeopleProgramme,
fPeopleQ : fPeopleQ,
nitroPips : nitroPips,
fPipsPage : fPipsPage,
fPipsPageSize : fPipsPageSize,
fPipsQ : fPipsQ,
nitroPromotions : nitroPromotions,
mPromotionsRelatedLinks : mPromotionsRelatedLinks,
fPromotionsContext : fPromotionsContext,
fPromotionsPage : fPromotionsPage,
fPromotionsPageSize : fPromotionsPageSize,
fPromotionsPartnerId : fPromotionsPartnerId,
fPromotionsPartnerPid : fPromotionsPartnerPid,
fPromotionsPid : fPromotionsPid,
fPromotionsPromotedBy : fPromotionsPromotedBy,
fPromotionsPromotedFor : fPromotionsPromotedFor,
fPromotionsQ : fPromotionsQ,
fPromotionsStatusCurrent : fPromotionsStatusCurrent,
fPromotionsStatus : fPromotionsStatus,
nitroSchedules : nitroSchedules,
sSchedulesStartDateAscending : sSchedulesStartDateAscending,
sSchedulesStartDateDescending : sSchedulesStartDateDescending,
mSchedulesAncestorTitles : mSchedulesAncestorTitles,
mSchedulesImages : mSchedulesImages,
fSchedulesAuthority : fSchedulesAuthority,
fSchedulesDescendantsOf : fSchedulesDescendantsOf,
fSchedulesEndFrom : fSchedulesEndFrom,
fSchedulesEndTo : fSchedulesEndTo,
fSchedulesFormat : fSchedulesFormat,
fSchedulesGenre : fSchedulesGenre,
fSchedulesGroup : fSchedulesGroup,
fSchedulesId : fSchedulesId,
fSchedulesIdType : fSchedulesIdType,
fSchedulesItem : fSchedulesItem,
fSchedulesPage : fSchedulesPage,
fSchedulesPageSize : fSchedulesPageSize,
fSchedulesPartnerId : fSchedulesPartnerId,
fSchedulesPartnerPid : fSchedulesPartnerPid,
fSchedulesPeople : fSchedulesPeople,
fSchedulesPid : fSchedulesPid,
fSchedulesQ : fSchedulesQ,
fSchedulesRepeat : fSchedulesRepeat,
fSchedulesScheduleDay : fSchedulesScheduleDay,
fSchedulesScheduleDayFrom : fSchedulesScheduleDayFrom,
fSchedulesScheduleDayTo : fSchedulesScheduleDayTo,
fSchedulesServiceMasterBrand : fSchedulesServiceMasterBrand,
fSchedulesSid : fSchedulesSid,
fSchedulesStartFrom : fSchedulesStartFrom,
fSchedulesStartTo : fSchedulesStartTo,
fSchedulesVersion : fSchedulesVersion,
nitroServices : nitroServices,
fServicesEndFrom : fServicesEndFrom,
fServicesEndTo : fServicesEndTo,
fServicesMid : fServicesMid,
fServicesPage : fServicesPage,
fServicesPageSize : fServicesPageSize,
fServicesPartnerId : fServicesPartnerId,
fServicesPartnerPid : fServicesPartnerPid,
fServicesQ : fServicesQ,
fServicesServiceTypeTv : fServicesServiceTypeTv,
fServicesServiceTypeLocalRadio : fServicesServiceTypeLocalRadio,
fServicesServiceTypeNationalRadio : fServicesServiceTypeNationalRadio,
fServicesServiceTypeRegionalRadio : fServicesServiceTypeRegionalRadio,
fServicesServiceTypeInteractive : fServicesServiceTypeInteractive,
fServicesServiceType : fServicesServiceType,
fServicesSid : fServicesSid,
fServicesStartFrom : fServicesStartFrom,
fServicesStartTo : fServicesStartTo,
nitroVersions : nitroVersions,
fVersionsAvailabilityAvailable : fVersionsAvailabilityAvailable,
fVersionsAvailability : fVersionsAvailability,
fVersionsDescendantsOf : fVersionsDescendantsOf,
fVersionsMediaSet : fVersionsMediaSet,
fVersionsPage : fVersionsPage,
fVersionsPageSize : fVersionsPageSize,
fVersionsPartnerId : fVersionsPartnerId,
fVersionsPartnerPid : fVersionsPartnerPid,
fVersionsPaymentTypeFree : fVersionsPaymentTypeFree,
fVersionsPaymentTypeBbcstore : fVersionsPaymentTypeBbcstore,
fVersionsPaymentTypeUscansvod : fVersionsPaymentTypeUscansvod,
fVersionsPaymentType : fVersionsPaymentType,
fVersionsPid : fVersionsPid,
apiHash : apiHash
}
