#!/usr/bin/perl

use strict;
use warnings;

use CGI qw( :standard );

my $fname = param('name');
print header({-type => 'text/plain'});

if ($fname =~ q|^/tmp/tmp......$|) {
    if (open IN, $fname) {
        my @lines = <IN>;
        close IN;
## unlink($fname);
        print @lines;
    } else {
        print h1("$fname not found");
    }
} else {
    ## invalid file name
    print h1("$fname is not a valid file");
}
