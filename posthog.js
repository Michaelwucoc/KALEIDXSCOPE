/* PostHog 初始化 */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags resetGroups onFeatureFlags addFeatureFlagsHandler onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_EbFV0jMwjKCuGijnLnLAOgMTsNE82rdRewKXrX5qq3F', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-01-30'
});

/* 将 data-umami-event 的点击同步到 PostHog */
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(e) {
        var el = e.target.closest('[data-umami-event]');
        if (el) {
            var eventName = el.getAttribute('data-umami-event');
            var props = {};
            [].forEach.call(el.attributes || [], function(attr) {
                if (attr.name.indexOf('data-umami-event-') === 0) {
                    props[attr.name.replace('data-umami-event-', '')] = attr.value;
                }
            });
            if (window.posthog && typeof posthog.capture === 'function') {
                posthog.capture(eventName, Object.keys(props).length ? props : undefined);
            }
        }
    });
});
