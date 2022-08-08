/**
 * MediaQueryListEvent ponyFill
 * @class
 */
export class MediaQueryListEventPonyFill {

    /**
     * Media query
     * @private
     * @property
     * @type {null|string}
     */
    #media = null;

    /**
     * Query matches
     * @private
     * @property
     * @type {boolean}
     */
    #matches = false;

    /**
     * Constructor
     * @constructor
     * @param {string} media - Media query
     * @param {boolean} matches - Query matches
     * @return {MediaQueryListEvent|MediaQueryListEventPonyFill} - Event object
     */
    constructor( media, matches ) {
        if ( typeof media !== 'string' || !media.length ) {
            throw new Error( 'MediaQueryListEventPolyFill::constructor First argument media must be a non empty string' );
        }
        if ( typeof matches !== 'boolean' ) {
            throw new Error( 'MediaQueryListEventPolyFill::constructor Second argument matches must be a boolean' );
        }
        this.#media = media;
        this.#matches = matches;
    }

    /**
     * Media getter
     * @public
     * @return {boolean} - True if query matches
     */
    get media() {
        return this.#media;
    }

    /**
     * Matches getter
     * @public
     * @return {boolean} - True if query matches
     */
    get matches() {
        return this.#matches;
    }
}
